import axios from "axios";
import { v4 as uuid } from "uuid";
import { FastifyReply as Response, FastifyRequest as Request } from "fastify";
import { TransactionLog } from "./types";
import {
  TransactionCreateRequest,
  TransactionCreateResponse,
  TransactionGetResponse,
} from "./interfaces";
import { CONFIG } from "../config";

const API_CLIENT = axios.create({
  baseURL: `http://${CONFIG.host}:${CONFIG.port}`,
});

export const DB: TransactionLog[] = [];

export const get = async (req: Request, res: Response) => {
  const transaction_id: string = ((req.params as any) || {}).transaction_id;
  if (!transaction_id) return;

  const items = DB.filter((item) => item.transaction_id === transaction_id);
  if (items.length !== 2) {
    return res.code(500).send({
      code: 500,
      message:
        "The number of transactions associated with this ID are incorrect.",
    });
    // Transaction ID '${transaction_id}' has ${items.length} legs. There
    // should only be 2.
  }

  const debit = items.find((item) => item.side === "debit");
  const credit = items.find((item) => item.side === "credit");
  if (!debit || !credit) {
    return res.code(500).send({
      code: 500,
      message: "Unable to find one or more associated transactions.",
    });
    // Transaction ID '${transaction_id}' is missing a credit or debit leg.
  }

  const response: TransactionGetResponse = { credit, debit };
  res.send(response);
};

export const post = async (req: Request, res: Response) => {
  // TODO: implement schema validation with Ajv
  const {
    source_account_id,
    target_account_id,
    amount,
  } = req.body as TransactionCreateRequest;

  // require source account id
  if (!source_account_id) {
    res.code(400).send({
      code: 400,
      message: "No source account ID provided.",
    });
    return;
  }
  // require target account id
  if (!target_account_id) {
    res.code(400).send({
      code: 400,
      message: "No target account ID provided.",
    });
    return;
  }
  // require a transfer amount
  if (!amount || amount <= 0) {
    res.code(400).send({
      code: 400,
      message: "Invalid or missing amount provided.",
    });
    return;
  }

  let source: any;
  let target: any;

  try {
    // get source and target accounts via the api
    const response = await API_CLIENT.get(`/account/${source_account_id}`);
    source = response.data;
  } catch (err) {
    return res.code(404).send({
      code: 404,
      message: "Source account not found.",
    });
  }

  try {
    const response = await API_CLIENT.get(`/account/${target_account_id}`);
    target = response.data;
  } catch (err) {
    return res.code(404).send({
      code: 404,
      message: "Target account not found.",
    });
  }

  if (source.balance - amount < 0) {
    res.code(400).send({
      code: 400,
      message: "Insufficient funds available.",
    });
    return;
  }

  source.balance -= amount;
  target.balance += amount;
  // send back / save source and target accounts;

  const transactionID = uuid();
  const debit: TransactionLog = {
    id: uuid(),
    side: "debit",
    amount: amount,
    timestamp: +new Date(),
    account_id: source.id,
    transaction_id: transactionID,
  };

  const credit: TransactionLog = {
    id: uuid(),
    side: "credit",
    amount: amount,
    timestamp: +new Date(),
    account_id: target.id,
    transaction_id: transactionID,
  };

  DB.push(debit, credit);

  const response: TransactionCreateResponse = {
    transaction_id: transactionID,
  };
  res.send(response);
};

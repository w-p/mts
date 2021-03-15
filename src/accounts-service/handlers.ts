import { v4 as uuid } from "uuid";
import { FastifyReply as Response, FastifyRequest as Request } from "fastify";
import { AccountGetResponse, AccountCreateResponse } from "./interfaces";
import { Account } from "./types";

export const DB: Account[] = [];

// get an existing account
export const get = async (req: Request, res: Response) => {
  const id: string = ((req.params as any) || {}).id;

  const account = DB.find((item) => item.id === id);
  if (!account) {
    return res.code(404).send({
      code: 404,
      message: "Account not found.",
    });
  }

  const response: AccountGetResponse = account;
  return res.send(response);
};

// update an existing account
export const put = async (req: Request, res: Response) => {
  const id: string = ((req.params as any) || {}).id;

  const index = DB.findIndex((item) => item.id === id);
  if (index < 0) {
    return res.code(404).send({
      code: 404,
      message: "Account not found.",
    });
  }

  const balance: number = ((req.body as any) || {}).balance;
  if (!balance || balance < 0) {
    return res.code(400).send({
      code: 400,
      message: `Balance '${balance}' is missing or non-negative.`,
    });
  }

  // write to db
  const account = DB[index];
  account.balance = balance;
  return res.code(200);
};

// create a new account
export const post = async (req: Request, res: Response) => {
  const body = ((req.body as any) || {}) as any;
  if (!body.nickname) {
    return res.code(400).send({
      code: 400,
      message: "Invalid or missing nickname.",
    });
  }

  const index = DB.findIndex((item) => item.nickname === body.nickname);
  if (index >= 0) {
    return res.code(409).send({
      code: 409,
      message: "An account with this nickname already exists.",
    });
  }

  const accountID = uuid();
  const account: Account = {
    id: accountID,
    nickname: body.nickname,
    balance: 0,
  };

  // write to db
  DB.push(account);

  const response: AccountCreateResponse = { id: accountID };
  return res.send(response);
};

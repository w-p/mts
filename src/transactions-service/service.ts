import {
  FastifyInstance as Fastify,
  RouteShorthandOptions as RouteOpts,
} from "fastify";

import { Done } from "./types";
import {
  TransactionErrorSchema,
  TransactionGetResponseSchema,
  TransactionCreateRequestSchema,
  TransactionCreateResponseSchema,
} from "./schemas";
import { get, post } from "./handlers";

const GET_OPTS: RouteOpts = {
  schema: {
    description: "Get a transaction by its transaction ID.",
    params: { transaction_id: { type: "string" } },
    response: {
      200: TransactionGetResponseSchema,
      "4xx": TransactionErrorSchema,
    },
  },
};

const POST_OPTS: RouteOpts = {
  schema: {
    description: `Create a new transaction. This creates two transaction 
      'legs', one for the debit side and one for the credit side. Each has a 
      unique ID but both are correlated by their \`transaction_id\`.`,
    body: TransactionCreateRequestSchema,
    response: {
      200: TransactionCreateResponseSchema,
      "4xx": TransactionErrorSchema,
    },
  },
};

export async function transactions(API: Fastify, options: any, done: Done) {
  // get a transaction set
  API.get("/transaction/:transaction_id", GET_OPTS, get);

  // execute a transaction
  API.post("/transaction", POST_OPTS, post);

  done();
}

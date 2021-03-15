import {
  FastifyInstance as Fastify,
  RouteShorthandOptions as RouteOpts,
} from "fastify";

import { Done } from "./types";
import {
  AccountGetResponseSchema,
  AccountCreateRequestSchema,
  AccountCreateResponseSchema,
  AccountUpdateRequestSchema,
  AccountErrorSchema,
} from "./schemas";
import { get, put, post } from "./handlers";

const GET_OPTS: RouteOpts = {
  schema: {
    description: "Get an account by ID.",
    params: { id: { type: "string" } },
    response: {
      200: AccountGetResponseSchema,
      "4xx": AccountErrorSchema,
    },
  },
};

const POST_OPTS: RouteOpts = {
  schema: {
    description: "Create a new account.",
    body: AccountCreateRequestSchema,
    response: {
      200: AccountCreateResponseSchema,
      "4xx": AccountErrorSchema,
    },
  },
};

const PUT_OPTS: RouteOpts = {
  schema: {
    description: `Update an existing account. For now, this only supports 
      updates to \`balance\`.`,
    params: { id: { type: "string" } },
    body: AccountUpdateRequestSchema,
    response: {
      "4xx": AccountErrorSchema,
    },
  },
};

export async function accounts(API: Fastify, options: any, done: Done) {
  // get account
  API.get("/account/:id", GET_OPTS, get);

  // update account
  API.put("/account/:id", PUT_OPTS, put);

  // create account
  API.post("/account", POST_OPTS, post);
}

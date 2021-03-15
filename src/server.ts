import { FastifyInstance } from "fastify";
import { fastify } from "fastify";
import cors from "fastify-cors";
import documentation from "fastify-swagger";
import { CONFIG } from "./config";
import { accounts } from "./accounts-service/service";
import { transactions } from "./transactions-service/service";

let api: FastifyInstance;

export const setup = (logging: boolean = true): FastifyInstance => {
  if (api) {
    return api;
  }

  api = fastify({ logger: logging });

  // register documentation
  api.register(documentation, {
    exposeRoute: true,
    routePrefix: "/docs",
    openapi: {
      info: {
        title: "mts-api",
        description: `An API for executing transactions between accounts. 
          Everything is an account; bank, credit card, brokerage, etc. This 
          includes but is not limited to internal accounts, clearing house 
          accounts, and personal accounts. In this system a transaction consists 
          of two legs, the debit side and the credit side. When a transaction is 
          executed, a debit is first performed against the payer followed by a 
          credit against the payee.`,
        version: "latest / 14-MAR-2020",
      },
    },
  });

  // because this is not production code
  api.register(cors, { origin: "*" });

  // register endpoints
  api.register(accounts);
  api.register(transactions);

  // register versioned endpoints
  api.register(accounts, { prefix: "14-MAR-2020" });
  api.register(transactions, { prefix: "14-MAR-2020" });

  return api;
};

// main entrypoint, starts up an API server
const main = async () => {
  const api = setup();
  try {
    await api.listen(CONFIG.port, CONFIG.host);
  } catch (err) {
    console.error(err);
    // process.exit(1);
  }
};

main();

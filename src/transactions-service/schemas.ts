export const TransactionGetResponseSchema = {
  type: "object",
  properties: {
    debit: {
      type: "object",
      properties: {
        id: { type: "string" },
        side: { type: "string" },
        amount: { type: "number" },
        timestamp: { type: "number" },
        account_id: { type: "string" },
        transaction_id: { type: "string" },
      },
    },
    credit: {
      type: "object",
      properties: {
        id: { type: "string" },
        side: { type: "string" },
        amount: { type: "number" },
        timestamp: { type: "number" },
        account_id: { type: "string" },
        transaction_id: { type: "string" },
      },
    },
  },
};

export const TransactionCreateRequestSchema = {
  type: "object",
  properties: {
    amount: { type: "number" },
    source_account_id: { type: "string" },
    target_account_id: { type: "string" },
  },
};

export const TransactionCreateResponseSchema = {
  type: "object",
  properties: {
    transaction_id: { type: "string" },
  },
};

export const TransactionErrorSchema = {
  type: "object",
  properties: {
    code: { type: "number" },
    message: { type: "string" },
  },
};

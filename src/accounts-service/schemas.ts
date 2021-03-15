export const AccountGetResponseSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    balance: { type: "number" },
    nickname: { type: "string" },
  },
};
export const AccountCreateRequestSchema = {
  type: "object",
  properties: {
    nickname: { type: "string" },
  },
};

export const AccountCreateResponseSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
};

export const AccountUpdateRequestSchema = {
  type: "object",
  properties: {
    balance: { type: "number" },
  },
};

export const AccountErrorSchema = {
  type: "object",
  properties: {
    code: { type: "number" },
    message: { type: "string" },
  },
};

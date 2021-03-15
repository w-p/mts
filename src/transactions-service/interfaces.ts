export interface TransactionCreateRequest {
  amount: number;
  source_account_id: string;
  target_account_id: string;
}

export interface TransactionCreateResponse {
  transaction_id: string;
}

export interface TransactionGetResponse {
  debit: {
    id: string;
    side: "credit" | "debit";
    amount: number;
    timestamp: number;
    account_id: string;
    transaction_id: string;
  };
  credit: {
    id: string;
    side: "credit" | "debit";
    amount: number;
    timestamp: number;
    account_id: string;
    transaction_id: string;
  };
}

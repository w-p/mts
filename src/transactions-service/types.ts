export type Done = (err?: Error | undefined) => void;

export type TransactionLog = {
  id: string;
  amount: number;
  timestamp: number;
  account_id: string;
  transaction_id: string;
  side: "credit" | "debit";
};

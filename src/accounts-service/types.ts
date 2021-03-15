export type Done = (err?: Error | undefined) => void;

export type Account = {
  id: string;
  balance: number;
  nickname: string;
};

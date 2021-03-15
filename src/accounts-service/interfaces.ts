export interface AccountCreateResponse {
  id: string;
}

export interface AccountGetResponse {
  id: string;
  balance: number;
  nickname: string;
}

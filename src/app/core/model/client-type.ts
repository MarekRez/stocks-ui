export type ClientModel = {
  id?: number;
  username: string;
  email: string;
  role: string;
  iban?: string;
  bankAccountBalance?: number;
  investmentAccountBalance?: number;
};

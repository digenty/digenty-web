export interface Fee {
  id: number;
  title: string;
  paid: number;
  amount: number;
  balance: number;
  minimumDeposit?: number;
}

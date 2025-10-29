export type ActiveAlert = {
  id: number;
  title: string;
  description: string;
  action: string;
  type: AlertType;
};

export interface AlertListProps {
  alert: {
    id: number;
    title: string;
    description: string;
    action: string;
    label: string;
    type: AlertType;
  };
}

export enum AlertType {
  results = "results",
  fees = "fees",
  attendance = "attendance",
}

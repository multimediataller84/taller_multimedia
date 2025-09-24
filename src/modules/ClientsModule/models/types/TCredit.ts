export type TCredit = {
  enabled: boolean;
  unlimited: boolean;
  limit: number | null;
};

export type TCreditSummary = {
  enabled: boolean;
  unlimited: boolean;
  limit: number | null;
  used: number;
  available: number | "infinite";
};

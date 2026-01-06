export const userKeys = {
  all: ["users"] as const,
  detail: (email: string) => ["users", email] as const,
};

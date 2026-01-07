export const userKeys = {
  all: ["users"] as const,
  userByEmail: (email: string) => ["users", email] as const,
};

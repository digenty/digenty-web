export const subscriptionKeys = {
  current: ["currentSubscription"] as const,
  active: ["activeSubscription"] as const,
  plans: ["subscriptionPlans"] as const,
  billingHistory: (page: number, size: number) => ["subscriptionBillingHistory", page, size] as const,
  create: ["createSubscription"] as const,
};

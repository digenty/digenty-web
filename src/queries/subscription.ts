export const subscriptionKeys = {
  current: ["currentSubscription"] as const,
  active: ["activeSubscription"] as const,
  plans: ["subscriptionPlans"] as const,
  billingHistory: (page: number, size: number) => ["subscriptionBillingHistory", page, size] as const,
  create: ["createSubscription"] as const,
  checkout: ["checkoutSubscription"] as const,
  verify: (reference: string) => ["verifySubscription", reference] as const,
  update: ["updateSubscription"] as const,
  cancel: ["cancelSubscription"] as const,
  renew: ["renewSubscription"] as const,
};

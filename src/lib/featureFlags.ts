export const FEATURE_FLAGS = {
  shop: process.env.NEXT_PUBLIC_FEATURE_SHOP === "true",
} as const;

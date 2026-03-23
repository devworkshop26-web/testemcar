export type LoyaltyStat = {
  label: string;
  value: string;
  helper: string;
};

export type LoyaltyBenefit = {
  title: string;
  description: string;
  icon: string;
};

export type LoyaltyHistoryItem = {
  id: string;
  label: string;
  description: string;
  points: number;
  status: "earned" | "pending" | "redeemed" | "cancelled";
  display_status: "earned" | "pending" | "redeemed" | "cancelled";
  created_at: string;
  metadata?: Record<string, unknown>;
};

export type LoyaltyTier = {
  name: string;
  threshold_label: string;
  active?: boolean;
  perks: string[];
  helper?: string;
};

export type LoyaltyAction = {
  label: string;
  href: string;
  variant?: "default" | "outline";
};

export type LoyaltySummaryResponse = {
  title: string;
  subtitle: string;
  points: number;
  next_tier_label: string;
  points_to_next_tier: number;
  progress: number;
  member_since: string;
  discount_label: string;
  current_tier: string;
  current_tier_helper: string;
  next_tier_display: string;
  stats: LoyaltyStat[];
  benefits: LoyaltyBenefit[];
  history: LoyaltyHistoryItem[];
  tiers: LoyaltyTier[];
  actions: LoyaltyAction[];
};

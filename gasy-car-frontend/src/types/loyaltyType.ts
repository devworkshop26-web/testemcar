export interface LoyaltyStat {
  label: string;
  value: string;
  helper: string;
}

export interface LoyaltyHistoryItem {
  id: string;
  title: string;
  date: string;
  points: number;
  status: "earned" | "redeemed" | "pending";
  description: string;
  source: string;
}

export interface LoyaltyTier {
  name: string;
  min_points: number;
  max_points: number | null;
  threshold_label: string;
  perks: string[];
  active: boolean;
}

export interface LoyaltyRule {
  title: string;
  description: string;
  enabled: boolean;
}

export interface LoyaltyDashboard {
  title: string;
  subtitle: string;
  points: number;
  next_tier_label: string;
  points_to_next_tier: number;
  progress: number;
  member_since: string;
  discount_label: string;
  current_tier: string;
  profile_completed: boolean;
  stats: LoyaltyStat[];
  history: LoyaltyHistoryItem[];
  tiers: LoyaltyTier[];
  earning_rules: LoyaltyRule[];
}

export type ContributorType = 'none' | 'author' | 'journalist';

export interface User {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  gender?: string;
  avatarUrl?: string;
  expertiseTags?: string[];
  role?: 'user' | 'moderator' | 'admin';
  isEmailVerified: boolean;
  isVerifiedBadge: boolean;
  subscriptionTier?: 'free' | 'verified';
  reputationScore: number;
  badges: string[];
  contributorType?: ContributorType;
  followers?: number | string[];
  following?: number | string[];
  createdAt?: string;
}

export interface ApiError {
  success: false;
  statusCode: number;
  message: string;
}

export interface BrandItem {
  name: string;
  style: React.CSSProperties;
}

// ---- Posts ----

export type PostType = 'discussion' | 'news' | 'article';

export const POST_TYPE_LABELS: Record<PostType, string> = {
  discussion: 'Discussion',
  news: 'News + Analysis',
  article: 'Article',
};
export type PostStatus = 'draft' | 'published' | 'removed';

export const CATEGORY_VALUES = [
  'global_affairs',
  'asia_pacific',
  'europe',
  'middle_east',
  'africa',
  'americas',
  'russia_ukraine',
  'china',
  'india',
  'economy',
  'defense',
  'intelligence',
  'diplomacy',
  'energy',
  'cybersecurity',
] as const;

export type Category = (typeof CATEGORY_VALUES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  global_affairs: 'Global Affairs',
  asia_pacific: 'Asia-Pacific',
  europe: 'Europe',
  middle_east: 'Middle East',
  africa: 'Africa',
  americas: 'Americas',
  russia_ukraine: 'Russia–Ukraine',
  china: 'China',
  india: 'India',
  economy: 'Economy',
  defense: 'Defense',
  intelligence: 'Intelligence',
  diplomacy: 'Diplomacy',
  energy: 'Energy',
  cybersecurity: 'Cybersecurity',
};

// One distinct soft shade per category so a row of tags reads at a glance instead of blurring
// into identical gray pills. Kept muted (100/800 pairings) to stay in line with the rest of the
// premium, low-saturation UI rather than turning tags into a rainbow.
export const CATEGORY_COLORS: Record<Category, string> = {
  global_affairs: 'bg-slate-100 text-slate-700',
  asia_pacific: 'bg-amber-100 text-amber-800',
  europe: 'bg-blue-100 text-blue-800',
  middle_east: 'bg-orange-100 text-orange-800',
  africa: 'bg-emerald-100 text-emerald-800',
  americas: 'bg-sky-100 text-sky-800',
  russia_ukraine: 'bg-red-100 text-red-800',
  china: 'bg-rose-100 text-rose-800',
  india: 'bg-teal-100 text-teal-800',
  economy: 'bg-yellow-100 text-yellow-800',
  defense: 'bg-stone-200 text-stone-800',
  intelligence: 'bg-indigo-100 text-indigo-800',
  diplomacy: 'bg-violet-100 text-violet-800',
  energy: 'bg-lime-100 text-lime-800',
  cybersecurity: 'bg-cyan-100 text-cyan-800',
};

export interface PostImage {
  url: string;
  publicId: string;
  caption?: string;
}

export interface PostAuthor {
  _id: string;
  name: string;
  avatarUrl?: string;
  isVerifiedBadge?: boolean;
  reputationScore?: number;
  badges?: string[];
  contributorType?: ContributorType;
}

export interface Post {
  _id: string;
  author: PostAuthor | string;
  type: PostType;
  title: string;
  content: string;
  sourceUrl?: string;
  sourceName?: string;
  images: PostImage[];
  categories: Category[];
  tags: string[];
  status: PostStatus;
  estimatedReadMinutes: number;
  upvoteCount: number;
  downvoteCount: number;
  commentCount: number;
  viewCount: number;
  createdAt: string;
  publishedAt?: string;
}

export interface Feed {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
}

// ---- Comments ----

export interface Comment {
  _id: string;
  post: string;
  author: PostAuthor | string;
  parentComment: string | null;
  content: string;
  upvoteCount: number;
  downvoteCount: number;
  isDeleted: boolean;
  createdAt: string;
  replies?: Comment[];
}

// ---- Votes ----

export type VoteTargetType = 'post' | 'comment';
export type VoteValue = 1 | -1;

// ---- Reports ----

export type ReportReason =
  | 'misleading'
  | 'offensive'
  | 'spam'
  | 'harassment'
  | 'hate_speech'
  | 'misinformation'
  | 'other';

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  misleading: 'Misleading',
  offensive: 'Offensive',
  spam: 'Spam',
  harassment: 'Harassment',
  hate_speech: 'Hate speech',
  misinformation: 'Misinformation',
  other: 'Other',
};

export type ReportStatus = 'pending' | 'reviewed' | 'action_taken' | 'dismissed';

export interface Report {
  _id: string;
  reporter: { _id: string; name: string; email: string } | string;
  targetId: string;
  targetType: 'post' | 'comment' | 'user';
  reason: ReportReason;
  details?: string;
  status: ReportStatus;
  createdAt: string;
}

// ---- Notifications ----

export type NotificationType =
  | 'new_post_in_topic'
  | 'new_comment_reply'
  | 'new_follower'
  | 'post_upvoted_milestone'
  | 'report_actioned'
  | 'system';

export interface AppNotification {
  _id: string;
  type: NotificationType;
  title: string;
  body?: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

// ---- Bookmarks ----

export interface Bookmark {
  _id: string;
  post: Post;
  createdAt: string;
}

// ---- Admin ----

export interface AdminOverview {
  users: { total: number; newLast30Days: number };
  content: { totalPosts: number; publishedPosts: number; totalComments: number };
  moderation: { pendingReports: number };
  revenue: { totalInPaise: number; last30DaysInPaise: number; activeSubscribers: number };
}

export interface AdminUserRow extends User {
  isBanned?: boolean;
}

// ---- Subscription ----

export type SubscriptionPlan = 'monthly' | 'yearly';
export type SubscriptionPaymentStatus = 'created' | 'paid' | 'failed' | 'refunded';

export interface Subscription {
  _id: string;
  plan: SubscriptionPlan;
  amountInPaise: number;
  currency: string;
  status: SubscriptionPaymentStatus;
  periodStart?: string;
  periodEnd?: string;
  createdAt: string;
}

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  subscriptionId: string;
}

// ---- Contributor applications (Author/Journalist badge applications) ----

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface ContributorApplication {
  _id: string;
  user: PostAuthor | string;
  requestedRole: 'author' | 'journalist';
  motivation: string;
  portfolioLinks: string[];
  status: ApplicationStatus;
  isPaidAtApplication: boolean;
  reviewedBy?: { _id: string; name: string } | string;
  reviewedAt?: string;
  reviewNotes?: string;
  createdAt: string;
}

// ---- Referral codes (Author/Journalist onboarding) ----

export interface ReferralCode {
  _id: string;
  code: string;
  role: 'author' | 'journalist';
  createdBy: { _id: string; name: string; email: string } | string;
  usedBy?: { _id: string; name: string; email: string } | string;
  usedAt?: string;
  expiresAt?: string;
  note?: string;
  isRevoked: boolean;
  createdAt: string;
}

// ---- Search ----

export interface SearchResults {
  articles: Post[];
  discussions: Post[];
  users: PostAuthor[];
}
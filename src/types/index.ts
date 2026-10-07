export type UserRole = 'buyer' | 'seller' | 'admin' | 'superadmin';

export type UserStatus = 'active' | 'suspended' | 'blocked';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  city?: string;
  state?: string;
  status: UserStatus;
  joinedDate: string;
  lastLogin?: string;
  isVerified?: boolean;
}

export type VehicleStatus = 
  | 'draft' 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'published' 
  | 'sold' 
  | 'expired' 
  | 'archived';

export type VehicleCategoryType = string;

export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'CNG' | 'LPG';

export type TransmissionType = 'Manual' | 'Automatic' | 'Semi-Automatic';

export type OwnershipType = 'First Owner' | 'Second Owner' | 'Third Owner' | '4+ Owners';

export type ConditionType = 'Brand New' | 'Like New' | 'Excellent' | 'Good' | 'Fair';

export interface VehicleLocation {
  country: string;
  state: string;
  city: string;
  area: string;
  pincode: string;
}

export interface SellerInfo {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  sellerType: 'Individual' | 'Dealer' | 'Direct Owner';
  isVerified: boolean;
  memberSince?: string;
  responseRate?: string;
}

export interface Vehicle {
  id: string;
  sellerId: string;
  title: string;
  category: VehicleCategoryType;
  categoryId: string;
  categoryName: string;
  brandId: string;
  brandName: string;
  brandLogo?: string;
  model: string;
  variant: string;
  year: number;
  price: number;
  negotiable: boolean;
  fuelType: FuelType;
  transmission: TransmissionType;
  kmDriven: number;
  color: string;
  engine: string;
  ownership: OwnershipType;
  registrationNumber: string;
  registrationState?: string;
  insurance: string;
  condition: ConditionType;
  description: string;
  images: string[];
  featuredImage: string;
  location: VehicleLocation;
  sellerInfo: SellerInfo;
  status: VehicleStatus;
  rejectionReason?: string;
  featured: boolean;
  featuredStartDate?: string;
  featuredEndDate?: string;
  views: number;
  interestCount: number;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

export type InterestStatus = 
  | 'New' 
  | 'Contacted' 
  | 'Interested' 
  | 'Negotiating' 
  | 'Closed' 
  | 'Not Interested';

export interface Interest {
  id: string;
  vehicleId: string;
  vehicleTitle: string;
  vehicleImage: string;
  vehiclePrice: number;
  sellerId: string;
  buyerId?: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  buyerLocation: string;
  preferredContact: 'Phone Call' | 'WhatsApp' | 'Email';
  message: string;
  status: InterestStatus;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  receiverId: string;
  vehicleId: string;
  vehicleTitle?: string;
  vehicleImage?: string;
  text: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participantNames: { [userId: string]: string };
  participantAvatars?: { [userId: string]: string };
  vehicleId: string;
  vehicleTitle: string;
  vehicleImage: string;
  vehiclePrice: number;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: { [userId: string]: number };
}

export interface Category {
  id: string;
  name: VehicleCategoryType;
  slug: string;
  icon: string;
  image: string;
  description: string;
  subcategories: string[];
  listingCount: number;
  active: boolean;
  sortOrder: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  category: VehicleCategoryType[];
  description: string;
  listingCount: number;
  active: boolean;
}

export interface LocationItem {
  id: string;
  name: string;
  state: string;
  country: string;
  listingCount: number;
  active: boolean;
}

export type ReportReason = 
  | 'Fake Listing' 
  | 'Incorrect Price' 
  | 'Wrong Information' 
  | 'Duplicate' 
  | 'Scam' 
  | 'Inappropriate Content' 
  | 'Vehicle Already Sold' 
  | 'Other';

export interface ListingReport {
  id: string;
  vehicleId: string;
  vehicleTitle: string;
  reporterEmail: string;
  reporterName?: string;
  reason: ReportReason;
  details: string;
  status: 'Pending' | 'Reviewed' | 'Dismissed' | 'Action Taken';
  createdAt: string;
  actionTaken?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'approval' | 'interest' | 'message';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface AdminLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: 'Vehicle' | 'User' | 'Category' | 'Brand' | 'Location' | 'Report' | 'Interest' | 'Settings' | 'Testimonial';
  targetId: string;
  details: string;
  timestamp: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  image: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface EmiBank {
  id: string;
  bankName: string;
  annualInterestRate: number; // e.g. 8.5%
  minDownPaymentPercent: number; // e.g. 15%
  tenureMonths: number[]; // e.g. [12, 24, 36, 48, 60, 84]
  processingFee: string; // e.g. "0.5% or ₹1,500"
  logoUrl?: string;
  isPopular?: boolean;
}

export interface EmiLead {
  id: string;
  vehicleId: string;
  vehicleTitle: string;
  vehicleImage?: string;
  vehiclePrice: number;
  buyerName: string;
  buyerPhone: string;
  buyerEmail?: string;
  buyerCity?: string;
  bankName: string;
  loanAmount: number;
  downPayment: number;
  tenureMonths: number;
  monthlyEmi: number;
  interestRate: number;
  status: 'New' | 'Bank Followup' | 'Approved' | 'Rejected';
  createdAt: string;
}

export interface PlatformSettings {
  adminContactNumber: string;
  adminWhatsappNumber?: string;
  supportEmail: string;
  requireAdminApproval: boolean;
  commissionFeePercent: number;
  defaultEmiInterestRate: number;
  emiBanks: EmiBank[];
}

export interface MarketplaceFilter {
  search: string;
  category: string;
  brand: string;
  model: string;
  location: string;
  minPrice: number | null;
  maxPrice: number | null;
  minYear: number | null;
  maxYear: number | null;
  fuelType: string;
  transmission: string;
  ownership: string;
  condition: string;
  sellerType: string;
  sortBy: 'relevance' | 'newest' | 'price_asc' | 'price_desc' | 'views_desc';
}

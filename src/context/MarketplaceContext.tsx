import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Vehicle, 
  Category, 
  Brand, 
  LocationItem, 
  Interest, 
  Conversation, 
  Message, 
  ListingReport, 
  AdminLog, 
  MarketplaceFilter,
  VehicleStatus,
  InterestStatus,
  EmiBank,
  EmiLead,
  PlatformSettings,
  Testimonial
} from '../types';
import { StorageService } from '../lib/storage';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

interface MarketplaceContextType {
  vehicles: Vehicle[];
  publishedVehicles: Vehicle[];
  featuredVehicles: Vehicle[];
  categories: Category[];
  brands: Brand[];
  locations: LocationItem[];
  interests: Interest[];
  emiLeads: EmiLead[];
  conversations: Conversation[];
  messages: Message[];
  favorites: string[];
  reports: ListingReport[];
  adminLogs: AdminLog[];
  testimonials: Testimonial[];
  filters: MarketplaceFilter;
  setFilters: React.Dispatch<React.SetStateAction<MarketplaceFilter>>;
  resetFilters: () => void;
  filteredVehicles: Vehicle[];
  pendingApprovalsCount: number;
  
  // Actions
  getVehicleById: (id: string) => Vehicle | undefined;
  addVehicle: (vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'interestCount' | 'status'>) => Promise<string>;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => Promise<void>;
  approveVehicle: (id: string, adminName: string) => Promise<void>;
  rejectVehicle: (id: string, reason: string, adminName: string) => Promise<void>;
  toggleFeatured: (id: string) => Promise<void>;
  markAsSold: (id: string) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  resubmitForApproval: (id: string) => Promise<void>;
  
  // Buyer Actions
  submitInterest: (interestData: Omit<Interest, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<string>;
  updateInterestStatus: (id: string, status: InterestStatus, notes?: string) => Promise<void>;
  toggleFavorite: (vehicleId: string) => void;
  isFavorite: (vehicleId: string) => boolean;

  // EMI Loans
  submitEmiInquiry: (leadData: Omit<EmiLead, 'id' | 'createdAt' | 'status'>) => Promise<string>;
  updateEmiLeadStatus: (id: string, status: EmiLead['status']) => Promise<void>;
  deleteEmiLead: (id: string) => Promise<void>;
  saveEmiBank: (bank: EmiBank) => void;
  deleteEmiBank: (id: string) => void;
  
  // Messaging
  sendMessage: (conversationId: string | null, text: string, receiverId: string, vehicleId: string) => Promise<void>;
  getConversationMessages: (conversationId: string) => Message[];
  
  // Reports
  submitReport: (report: Omit<ListingReport, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateReportStatus: (id: string, status: ListingReport['status'], actionTaken?: string) => Promise<void>;
  
  // Platform Settings
  settings: PlatformSettings;
  updateSettings: (newSettings: Partial<PlatformSettings>) => void;

  // Admin Catalogs
  saveCategoryItem: (category: Category) => void;
  deleteCategoryItem: (id: string) => void;
  saveBrandItem: (brand: Brand) => void;
  deleteBrandItem: (id: string) => void;
  saveLocationItem: (location: LocationItem) => void;
  deleteLocationItem: (id: string) => void;

  // Testimonials
  addTestimonial: (item: Testimonial) => void;
  updateTestimonialStatus: (id: string, status: 'pending' | 'approved' | 'rejected') => void;
  deleteTestimonial: (id: string) => void;
}

const DEFAULT_FILTERS: MarketplaceFilter = {
  search: '',
  category: 'All',
  brand: 'All',
  model: 'All',
  location: 'All',
  minPrice: null,
  maxPrice: null,
  minYear: null,
  maxYear: null,
  fuelType: 'All',
  transmission: 'All',
  ownership: 'All',
  condition: 'All',
  sellerType: 'All',
  sortBy: 'relevance',
};

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isSuperAdmin } = useAuth();
  const { showToast, addNotification } = useNotification();

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => StorageService.getVehicles());
  const [categories, setCategories] = useState<Category[]>(() => StorageService.getCategories());
  const [brands, setBrands] = useState<Brand[]>(() => StorageService.getBrands());
  const [locations, setLocations] = useState<LocationItem[]>(() => StorageService.getLocations());
  const [interests, setInterests] = useState<Interest[]>(() => StorageService.getInterests());
  const [emiLeads, setEmiLeads] = useState<EmiLead[]>(() => StorageService.getEmiLeads());
  const [conversations, setConversations] = useState<Conversation[]>(() => StorageService.getConversations());
  const [messages, setMessages] = useState<Message[]>(() => StorageService.getMessages());
  const [favorites, setFavorites] = useState<string[]>(() => StorageService.getFavorites());
  const [reports, setReports] = useState<ListingReport[]>(() => StorageService.getReports());
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>(() => StorageService.getAdminLogs());
  const [settings, setSettings] = useState<PlatformSettings>(() => StorageService.getSettings());
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => StorageService.getTestimonials());

  const [filters, setFilters] = useState<MarketplaceFilter>(DEFAULT_FILTERS);

  // Sync state on load
  useEffect(() => {
    StorageService.initializeDefaults();
    setVehicles(StorageService.getVehicles());
    setCategories(StorageService.getCategories());
    setBrands(StorageService.getBrands());
    setLocations(StorageService.getLocations());
    setInterests(StorageService.getInterests());
    setEmiLeads(StorageService.getEmiLeads());
    setConversations(StorageService.getConversations());
    setMessages(StorageService.getMessages());
    setFavorites(StorageService.getFavorites());
    setReports(StorageService.getReports());
    setAdminLogs(StorageService.getAdminLogs());
    setSettings(StorageService.getSettings());
    setTestimonials(StorageService.getTestimonials());
  }, []);

  const publishedVehicles = useMemo(() => {
    return vehicles.filter(v => v.status === 'approved' || v.status === 'published' || v.status === 'sold');
  }, [vehicles]);

  const featuredVehicles = useMemo(() => {
    return publishedVehicles.filter(v => v.featured && v.status !== 'sold');
  }, [publishedVehicles]);

  const pendingApprovalsCount = useMemo(() => {
    return vehicles.filter(v => v.status === 'pending').length;
  }, [vehicles]);

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const filteredVehicles = useMemo(() => {
    return publishedVehicles.filter(vehicle => {
      // Search
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchTitle = vehicle.title.toLowerCase().includes(query);
        const matchBrand = vehicle.brandName.toLowerCase().includes(query);
        const matchModel = vehicle.model.toLowerCase().includes(query);
        const matchCity = vehicle.location.city.toLowerCase().includes(query);
        if (!matchTitle && !matchBrand && !matchModel && !matchCity) return false;
      }

      // Category
      if (filters.category !== 'All' && filters.category !== '') {
        if (vehicle.category !== filters.category && vehicle.categoryName !== filters.category) {
          return false;
        }
      }

      // Brand
      if (filters.brand !== 'All' && filters.brand !== '') {
        if (vehicle.brandName.toLowerCase() !== filters.brand.toLowerCase() && vehicle.brandId !== filters.brand) {
          return false;
        }
      }

      // Model
      if (filters.model !== 'All' && filters.model !== '') {
        if (vehicle.model.toLowerCase() !== filters.model.toLowerCase()) {
          return false;
        }
      }

      // Location
      if (filters.location !== 'All' && filters.location !== '') {
        if (
          !vehicle.location.city.toLowerCase().includes(filters.location.toLowerCase()) &&
          !vehicle.location.state.toLowerCase().includes(filters.location.toLowerCase())
        ) {
          return false;
        }
      }

      // Price
      if (filters.minPrice !== null && vehicle.price < filters.minPrice) return false;
      if (filters.maxPrice !== null && vehicle.price > filters.maxPrice) return false;

      // Year
      if (filters.minYear !== null && vehicle.year < filters.minYear) return false;
      if (filters.maxYear !== null && vehicle.year > filters.maxYear) return false;

      // Fuel Type
      if (filters.fuelType !== 'All' && filters.fuelType !== '') {
        if (vehicle.fuelType !== filters.fuelType) return false;
      }

      // Transmission
      if (filters.transmission !== 'All' && filters.transmission !== '') {
        if (vehicle.transmission !== filters.transmission) return false;
      }

      // Ownership
      if (filters.ownership !== 'All' && filters.ownership !== '') {
        if (vehicle.ownership !== filters.ownership) return false;
      }

      // Condition
      if (filters.condition !== 'All' && filters.condition !== '') {
        if (vehicle.condition !== filters.condition) return false;
      }

      // Seller Type
      if (filters.sellerType !== 'All' && filters.sellerType !== '') {
        if (vehicle.sellerInfo.sellerType !== filters.sellerType) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_asc') return a.price - b.price;
      if (filters.sortBy === 'price_desc') return b.price - a.price;
      if (filters.sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (filters.sortBy === 'views_desc') return b.views - a.views;
      // Relevance / Default: Featured first, then newest
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [publishedVehicles, filters]);

  const getVehicleById = (id: string) => {
    return vehicles.find(v => v.id === id);
  };

  const addVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'interestCount' | 'status'>): Promise<string> => {
    const id = 'veh-' + Date.now();
    const newVehicle: Vehicle = {
      ...vehicleData,
      id,
      status: 'pending', // Mandatorily Pending Approval
      views: 1,
      interestCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newVehicle, ...vehicles];
    setVehicles(updated);
    await StorageService.saveVehicle(newVehicle);

    // Notify Super Admin
    addNotification({
      userId: 'user-admin-1',
      title: 'New Vehicle Pending Approval',
      message: `"${newVehicle.title}" submitted by ${newVehicle.sellerInfo.name} for ₹${newVehicle.price.toLocaleString('en-IN')}`,
      type: 'approval',
      link: '/admin/approvals',
    });

    // Notify Seller
    addNotification({
      userId: newVehicle.sellerId,
      title: 'Vehicle Submitted for Review',
      message: `Your listing "${newVehicle.title}" has been submitted for Super Admin review.`,
      type: 'info',
      link: '/dashboard/listings',
    });

    showToast('success', 'Listing Submitted!', 'Your vehicle is now pending Super Admin review.');
    return id;
  };

  const updateVehicle = async (id: string, updates: Partial<Vehicle>) => {
    const v = vehicles.find(item => item.id === id);
    if (!v) return;

    // If an approved listing is edited by a non-admin, send it back to pending approval
    const shouldRequireReapproval = !isSuperAdmin && v.status === 'approved' && (updates.price !== undefined || updates.title !== undefined || updates.images !== undefined);

    const updatedVehicle: Vehicle = {
      ...v,
      ...updates,
      status: shouldRequireReapproval ? 'pending' : (updates.status || v.status),
      updatedAt: new Date().toISOString(),
    };

    const newVehicles = vehicles.map(item => item.id === id ? updatedVehicle : item);
    setVehicles(newVehicles);
    await StorageService.saveVehicle(updatedVehicle);

    if (shouldRequireReapproval) {
      showToast('info', 'Updated & Sent for Review', 'Since key details were edited, this listing will undergo quick admin re-approval.');
    } else {
      showToast('success', 'Listing Updated', 'Vehicle listing details updated successfully.');
    }
  };

  const approveVehicle = async (id: string, adminName: string) => {
    const v = vehicles.find(item => item.id === id);
    if (!v) return;

    const approvedVehicle: Vehicle = {
      ...v,
      status: 'approved',
      approvedAt: new Date().toISOString(),
      approvedBy: adminName,
      rejectionReason: undefined,
      updatedAt: new Date().toISOString(),
    };

    const updated = vehicles.map(item => item.id === id ? approvedVehicle : item);
    setVehicles(updated);
    await StorageService.saveVehicle(approvedVehicle);

    // Audit log
    const log: AdminLog = {
      id: 'log-' + Date.now(),
      adminId: user?.id || 'admin',
      adminName: adminName || user?.name || 'Super Admin',
      action: 'APPROVED_LISTING',
      targetType: 'Vehicle',
      targetId: id,
      details: `Approved listing "${v.title}" by ${v.sellerInfo.name}`,
      timestamp: new Date().toISOString(),
    };
    StorageService.addAdminLog(log);
    setAdminLogs(prev => [log, ...prev]);

    // Notify seller
    addNotification({
      userId: v.sellerId,
      title: 'Vehicle Approved & Live!',
      message: `Great news! Your listing "${v.title}" has been approved and is now visible on the marketplace.`,
      type: 'success',
      link: `/vehicles/${v.id}`,
    });

    showToast('success', 'Listing Approved', `"${v.title}" is now published publicly.`);
  };

  const rejectVehicle = async (id: string, reason: string, adminName: string) => {
    const v = vehicles.find(item => item.id === id);
    if (!v) return;

    const rejectedVehicle: Vehicle = {
      ...v,
      status: 'rejected',
      rejectionReason: reason,
      updatedAt: new Date().toISOString(),
    };

    const updated = vehicles.map(item => item.id === id ? rejectedVehicle : item);
    setVehicles(updated);
    await StorageService.saveVehicle(rejectedVehicle);

    // Audit log
    const log: AdminLog = {
      id: 'log-' + Date.now(),
      adminId: user?.id || 'admin',
      adminName: adminName || user?.name || 'Super Admin',
      action: 'REJECTED_LISTING',
      targetType: 'Vehicle',
      targetId: id,
      details: `Rejected "${v.title}". Reason: ${reason}`,
      timestamp: new Date().toISOString(),
    };
    StorageService.addAdminLog(log);
    setAdminLogs(prev => [log, ...prev]);

    // Notify seller
    addNotification({
      userId: v.sellerId,
      title: 'Listing Action Required',
      message: `Your listing "${v.title}" could not be approved. Reason: ${reason}`,
      type: 'warning',
      link: `/dashboard/listings/${v.id}/edit`,
    });

    showToast('warning', 'Listing Rejected', 'The seller has been notified with the rejection reason.');
  };

  const toggleFeatured = async (id: string) => {
    const v = vehicles.find(item => item.id === id);
    if (!v) return;

    const newFeatured = !v.featured;
    const updatedVehicle: Vehicle = {
      ...v,
      featured: newFeatured,
      featuredStartDate: newFeatured ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString(),
    };

    const updated = vehicles.map(item => item.id === id ? updatedVehicle : item);
    setVehicles(updated);
    await StorageService.saveVehicle(updatedVehicle);

    showToast('info', newFeatured ? 'Listing Featured' : 'Featured Status Removed', `"${v.title}" updated.`);
  };

  const markAsSold = async (id: string) => {
    const v = vehicles.find(item => item.id === id);
    if (!v) return;

    const updatedVehicle: Vehicle = {
      ...v,
      status: 'sold',
      updatedAt: new Date().toISOString(),
    };

    const updated = vehicles.map(item => item.id === id ? updatedVehicle : item);
    setVehicles(updated);
    await StorageService.saveVehicle(updatedVehicle);

    showToast('success', 'Marked as Sold', `Congratulations on selling "${v.title}"!`);
  };

  const deleteVehicle = async (id: string) => {
    const v = vehicles.find(item => item.id === id);
    const updated = vehicles.filter(item => item.id !== id);
    setVehicles(updated);
    await StorageService.deleteVehicle(id);

    showToast('info', 'Vehicle Removed', `"${v?.title || 'Listing'}" has been deleted.`);
  };

  const resubmitForApproval = async (id: string) => {
    const v = vehicles.find(item => item.id === id);
    if (!v) return;

    const updatedVehicle: Vehicle = {
      ...v,
      status: 'pending',
      rejectionReason: undefined,
      updatedAt: new Date().toISOString(),
    };

    const updated = vehicles.map(item => item.id === id ? updatedVehicle : item);
    setVehicles(updated);
    await StorageService.saveVehicle(updatedVehicle);

    showToast('success', 'Resubmitted for Review', 'Your updated listing is now in the review queue.');
  };

  // Buyer Interest submission
  const submitInterest = async (interestData: Omit<Interest, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<string> => {
    const id = 'int-' + Date.now();
    const newInterest: Interest = {
      ...interestData,
      id,
      status: 'New',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedInterests = [newInterest, ...interests];
    setInterests(updatedInterests);
    await StorageService.saveInterest(newInterest);

    // Trigger visual confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#38bdf8', '#10b981'],
      });
    } catch {
      // ignore
    }

    // Notify seller
    addNotification({
      userId: newInterest.sellerId,
      title: 'New Buyer Interest Received!',
      message: `${newInterest.buyerName} is interested in "${newInterest.vehicleTitle}". Phone: ${newInterest.buyerPhone}`,
      type: 'interest',
      link: '/dashboard/interests',
    });

    // Notify Super Admin
    addNotification({
      userId: 'user-admin-1',
      title: 'New Buyer Interest Request',
      message: `${newInterest.buyerName} (${newInterest.buyerPhone}) submitted an inquiry on "${newInterest.vehicleTitle}".`,
      type: 'interest',
      link: '/admin/interests',
    });

    showToast('success', 'Interest Submitted!', 'Your inquiry has been submitted and sent to the administration and seller.');
    return id;
  };

  const updateInterestStatus = async (id: string, status: InterestStatus, notes?: string) => {
    const interest = interests.find(i => i.id === id);
    if (!interest) return;

    const updated: Interest = {
      ...interest,
      status,
      notes: notes !== undefined ? notes : interest.notes,
      updatedAt: new Date().toISOString(),
    };

    const newInterests = interests.map(i => i.id === id ? updated : i);
    setInterests(newInterests);
    await StorageService.saveInterest(updated);

    showToast('info', 'Status Updated', `Enquiry status changed to "${status}".`);
  };

  const toggleFavorite = (vehicleId: string) => {
    let updated: string[];
    if (favorites.includes(vehicleId)) {
      updated = favorites.filter(id => id !== vehicleId);
      showToast('info', 'Removed from Favourites', 'Vehicle removed from your saved list.');
    } else {
      updated = [...favorites, vehicleId];
      showToast('success', 'Saved to Favourites', 'Vehicle added to your saved list.');
    }
    setFavorites(updated);
    StorageService.saveFavorites(updated);
  };

  const isFavorite = (vehicleId: string) => {
    return favorites.includes(vehicleId);
  };

  // Chat / Messages
  const sendMessage = async (conversationId: string | null, text: string, receiverId: string, vehicleId: string) => {
    if (!user) return;
    const v = vehicles.find(item => item.id === vehicleId);

    let convId = conversationId;
    if (!convId) {
      // Create conversation
      convId = `conv-${Date.now()}`;
      const newConv: Conversation = {
        id: convId,
        participantIds: [user.id, receiverId],
        participantNames: {
          [user.id]: user.name,
          [receiverId]: v?.sellerInfo.name || 'Seller',
        },
        participantAvatars: {
          [user.id]: user.avatar || '',
          [receiverId]: v?.sellerInfo.avatar || '',
        },
        vehicleId,
        vehicleTitle: v?.title || 'Vehicle',
        vehicleImage: v?.featuredImage || '',
        vehiclePrice: v?.price || 0,
        lastMessage: text,
        lastMessageTime: new Date().toISOString(),
        unreadCount: {
          [receiverId]: 1,
          [user.id]: 0,
        },
      };
      const newConvs = [newConv, ...conversations];
      setConversations(newConvs);
      StorageService.saveConversations(newConvs);
    }

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId: convId,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      receiverId,
      vehicleId,
      vehicleTitle: v?.title,
      text,
      createdAt: new Date().toISOString(),
      read: false,
    };

    const newMessages = [...messages, newMsg];
    setMessages(newMessages);
    await StorageService.saveMessage(newMsg);

    // Notify receiver
    addNotification({
      userId: receiverId,
      title: `New Message from ${user.name}`,
      message: text.length > 60 ? text.substring(0, 60) + '...' : text,
      type: 'message',
      link: '/dashboard/messages',
    });

    showToast('success', 'Message Sent', 'Your message has been delivered.');
  };

  const getConversationMessages = (convId: string) => {
    return messages.filter(m => m.conversationId === convId);
  };

  // Reports
  const submitReport = async (reportData: Omit<ListingReport, 'id' | 'createdAt' | 'status'>) => {
    const id = 'rep-' + Date.now();
    const newReport: ListingReport = {
      ...reportData,
      id,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    const updated = [newReport, ...reports];
    setReports(updated);
    StorageService.saveReports(updated);

    // Notify Admin
    addNotification({
      userId: 'user-admin-1',
      title: 'Listing Flagged by User',
      message: `"${newReport.vehicleTitle}" reported for: ${newReport.reason}`,
      type: 'warning',
      link: '/admin/reports',
    });

    showToast('info', 'Report Received', 'Thank you for keeping SatyaDeal safe. Our admin team will investigate.');
  };

  const updateReportStatus = async (id: string, status: ListingReport['status'], actionTaken?: string) => {
    const report = reports.find(r => r.id === id);
    if (!report) return;

    const updated: ListingReport = {
      ...report,
      status,
      actionTaken,
    };
    const newReports = reports.map(r => r.id === id ? updated : r);
    setReports(newReports);
    StorageService.saveReports(newReports);

    showToast('info', 'Report Updated', `Report marked as ${status}.`);
  };

  // Admin Catalogs
  const saveCategoryItem = (category: Category) => {
    const idx = categories.findIndex(c => c.id === category.id);
    let updated: Category[];
    if (idx >= 0) {
      updated = categories.map(c => c.id === category.id ? category : c);
    } else {
      updated = [...categories, category];
    }
    setCategories(updated);
    StorageService.saveCategories(updated);
    showToast('success', 'Category Saved', `"${category.name}" saved successfully.`);
  };

  const deleteCategoryItem = (id: string) => {
    const updated = categories.filter(c => c.id !== id);
    setCategories(updated);
    StorageService.saveCategories(updated);
    showToast('info', 'Category Removed', 'Category deleted.');
  };

  const saveBrandItem = (brand: Brand) => {
    const idx = brands.findIndex(b => b.id === brand.id);
    let updated: Brand[];
    if (idx >= 0) {
      updated = brands.map(b => b.id === brand.id ? brand : b);
    } else {
      updated = [...brands, brand];
    }
    setBrands(updated);
    StorageService.saveBrands(updated);
    showToast('success', 'Brand Saved', `"${brand.name}" saved successfully.`);
  };

  const deleteBrandItem = (id: string) => {
    const updated = brands.filter(b => b.id !== id);
    setBrands(updated);
    StorageService.saveBrands(updated);
    showToast('info', 'Brand Removed', 'Brand deleted.');
  };

  const saveLocationItem = (loc: LocationItem) => {
    const idx = locations.findIndex(l => l.id === loc.id);
    let updated: LocationItem[];
    if (idx >= 0) {
      updated = locations.map(l => l.id === loc.id ? loc : l);
    } else {
      updated = [...locations, loc];
    }
    setLocations(updated);
    StorageService.saveLocations(updated);
    showToast('success', 'Location Saved', `"${loc.name}" saved.`);
  };

  const deleteLocationItem = (id: string) => {
    const updated = locations.filter(l => l.id !== id);
    setLocations(updated);
    StorageService.saveLocations(updated);
    showToast('info', 'Location Removed', 'Location deleted.');
  };

  // EMI Inquiries & Loans
  const submitEmiInquiry = async (leadData: Omit<EmiLead, 'id' | 'createdAt' | 'status'>): Promise<string> => {
    const id = 'emi-' + Date.now();
    const newLead: EmiLead = {
      ...leadData,
      id,
      status: 'New',
      createdAt: new Date().toISOString(),
    };

    const updated = [newLead, ...emiLeads];
    setEmiLeads(updated);
    await StorageService.saveEmiLead(newLead);

    // Confetti
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#059669', '#10b981', '#2563eb', '#38bdf8'],
      });
    } catch {
      // ignore
    }

    // High Priority Super Admin Notification with click-to-open
    addNotification({
      userId: 'user-admin-1',
      title: `EMI Loan Lead: ₹${leadData.monthlyEmi.toLocaleString('en-IN')}/mo`,
      message: `${leadData.buyerName} (${leadData.buyerPhone}) applied for ${leadData.bankName} loan on "${leadData.vehicleTitle}".`,
      type: 'interest',
      link: '/admin/interests',
    });

    showToast('success', 'EMI Application Submitted!', `Loan inquiry for ${leadData.bankName} has been routed to Super Admin.`);
    return id;
  };

  const updateEmiLeadStatus = async (id: string, status: EmiLead['status']) => {
    const lead = emiLeads.find(l => l.id === id);
    if (!lead) return;

    const updated: EmiLead = { ...lead, status };
    const newLeads = emiLeads.map(l => l.id === id ? updated : l);
    setEmiLeads(newLeads);
    await StorageService.saveEmiLead(updated);
    showToast('info', 'EMI Lead Updated', `Application status changed to "${status}".`);
  };

  const deleteEmiLead = async (id: string) => {
    const updated = emiLeads.filter(l => l.id !== id);
    setEmiLeads(updated);
    await StorageService.deleteEmiLead(id);
    showToast('info', 'Lead Deleted', 'EMI lead removed.');
  };

  const saveEmiBank = (bank: EmiBank) => {
    const currentBanks = settings.emiBanks || [];
    const idx = currentBanks.findIndex(b => b.id === bank.id);
    let updatedBanks: EmiBank[];
    if (idx >= 0) {
      updatedBanks = currentBanks.map(b => b.id === bank.id ? bank : b);
    } else {
      updatedBanks = [...currentBanks, bank];
    }
    updateSettings({ emiBanks: updatedBanks });
  };

  const deleteEmiBank = (id: string) => {
    const currentBanks = settings.emiBanks || [];
    const updatedBanks = currentBanks.filter(b => b.id !== id);
    updateSettings({ emiBanks: updatedBanks });
  };

  const updateSettings = (newSettings: Partial<PlatformSettings>) => {
    const updated: PlatformSettings = { ...settings, ...newSettings };
    setSettings(updated);
    StorageService.saveSettings(updated);
    showToast('success', 'Settings Saved', 'Platform parameters updated successfully.');
  };

  // Testimonials
  const addTestimonial = (item: Testimonial) => {
    const newTestimonials = [...testimonials, item];
    setTestimonials(newTestimonials);
    StorageService.saveTestimonials(newTestimonials);
  };

  const updateTestimonialStatus = (id: string, status: 'pending' | 'approved' | 'rejected') => {
    const newTestimonials = testimonials.map(t => t.id === id ? { ...t, status } : t);
    setTestimonials(newTestimonials);
    StorageService.saveTestimonials(newTestimonials);
    logAdminAction(`Updated testimonial status to ${status}`, 'Testimonial', id, id);
  };

  const deleteTestimonial = (id: string) => {
    const newTestimonials = testimonials.filter(t => t.id !== id);
    setTestimonials(newTestimonials);
    StorageService.saveTestimonials(newTestimonials);
    logAdminAction('Deleted testimonial', 'Testimonial', id, id);
  };

  return (
    <MarketplaceContext.Provider
      value={{
        vehicles,
        publishedVehicles,
        featuredVehicles,
        categories,
        brands,
        locations,
        interests,
        emiLeads,
        conversations,
        messages,
        favorites,
        reports,
        adminLogs,
        testimonials,
        filters,
        setFilters,
        resetFilters,
        filteredVehicles,
        pendingApprovalsCount,
        settings,
        updateSettings,
        getVehicleById,
        addVehicle,
        updateVehicle,
        approveVehicle,
        rejectVehicle,
        toggleFeatured,
        markAsSold,
        deleteVehicle,
        resubmitForApproval,
        submitInterest,
        updateInterestStatus,
        submitEmiInquiry,
        updateEmiLeadStatus,
        deleteEmiLead,
        saveEmiBank,
        deleteEmiBank,
        toggleFavorite,
        isFavorite,
        sendMessage,
        getConversationMessages,
        submitReport,
        updateReportStatus,
        saveCategoryItem,
        deleteCategoryItem,
        saveBrandItem,
        deleteBrandItem,
        saveLocationItem,
        deleteLocationItem,
        addTestimonial,
        updateTestimonialStatus,
        deleteTestimonial,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};

import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  onSnapshot 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { 
  Vehicle, 
  Category, 
  Brand, 
  LocationItem, 
  UserProfile, 
  Interest, 
  Message, 
  Conversation, 
  ListingReport, 
  AppNotification, 
  AdminLog,
  EmiLead,
  PlatformSettings,
  Testimonial
} from '../types';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_BRANDS, 
  INITIAL_LOCATIONS, 
  INITIAL_USERS, 
  INITIAL_VEHICLES, 
  INITIAL_INTERESTS, 
  INITIAL_CONVERSATIONS, 
  INITIAL_MESSAGES, 
  INITIAL_ADMIN_LOGS,
  INITIAL_EMI_LEADS,
  INITIAL_PLATFORM_SETTINGS,
  INITIAL_TESTIMONIALS
} from '../data/seedData';

const LOCAL_STORAGE_PREFIX = 'satyadeal_';

function getLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
}

// Storage Service with dual Firestore sync and reliable fallback
export class StorageService {
  private static initialized = false;

  static async initializeDefaults() {
    if (this.initialized) return;
    this.initialized = true;

    setLocal('brands', INITIAL_BRANDS);
    setLocal('testimonials', INITIAL_TESTIMONIALS);

    // Check local storage initialization
    if (!localStorage.getItem(LOCAL_STORAGE_PREFIX + 'vehicles')) {
      setLocal('vehicles', INITIAL_VEHICLES);
      setLocal('categories', INITIAL_CATEGORIES);
      setLocal('brands', INITIAL_BRANDS);
      setLocal('testimonials', INITIAL_TESTIMONIALS);
      setLocal('locations', INITIAL_LOCATIONS);
      setLocal('users', INITIAL_USERS);
      setLocal('interests', INITIAL_INTERESTS);
      setLocal('conversations', INITIAL_CONVERSATIONS);
      setLocal('messages', INITIAL_MESSAGES);
      setLocal('adminLogs', INITIAL_ADMIN_LOGS);
      setLocal('favorites', ['veh-swift-1', 'veh-creta-3']);
      setLocal('reports', []);
      setLocal('emiLeads', INITIAL_EMI_LEADS);
      setLocal('settings', INITIAL_PLATFORM_SETTINGS);
      setLocal('notifications', [
        {
          id: 'notif-1',
          userId: 'seller-rohit',
          title: 'New Buyer Interest',
          message: 'Rahul Das submitted interest for your Maruti Suzuki Swift VXI.',
          type: 'interest',
          read: false,
          createdAt: new Date().toISOString(),
          link: '/admin/interests'
        },
        {
          id: 'notif-2',
          userId: 'seller-rohit',
          title: 'Listing Approved',
          message: 'Your listing "Maruti Suzuki Swift VXI" is approved and now live!',
          type: 'approval',
          read: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          link: '/vehicles/veh-swift-1'
        },
        {
          id: 'notif-3',
          userId: 'user-admin-1',
          title: 'New EMI Application: ₹8,538/mo',
          message: 'Rahul Das requested HDFC Bank auto loan EMI sanction for Maruti Suzuki Swift VXI.',
          type: 'interest',
          read: false,
          createdAt: new Date().toISOString(),
          link: '/admin/interests'
        }
      ]);
    }
  }

  // Vehicles
  static getVehicles(): Vehicle[] {
    return getLocal<Vehicle[]>('vehicles', INITIAL_VEHICLES);
  }

  static async saveVehicle(vehicle: Vehicle): Promise<void> {
    const vehicles = this.getVehicles();
    const index = vehicles.findIndex(v => v.id === vehicle.id);
    if (index >= 0) {
      vehicles[index] = vehicle;
    } else {
      vehicles.unshift(vehicle);
    }
    setLocal('vehicles', vehicles);

    try {
      await setDoc(doc(db, 'vehicles', vehicle.id), vehicle);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `vehicles/${vehicle.id}`);
    }
  }

  static async deleteVehicle(id: string): Promise<void> {
    const vehicles = this.getVehicles().filter(v => v.id !== id);
    setLocal('vehicles', vehicles);

    try {
      await deleteDoc(doc(db, 'vehicles', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `vehicles/${id}`);
    }
  }

  // Categories
  static getCategories(): Category[] {
    return getLocal<Category[]>('categories', INITIAL_CATEGORIES);
  }

  static saveCategories(categories: Category[]) {
    setLocal('categories', categories);
  }

  // Brands
  static getBrands(): Brand[] {
    return getLocal<Brand[]>('brands', INITIAL_BRANDS);
  }

  static saveBrands(brands: Brand[]) {
    setLocal('brands', brands);
  }

  // Locations
  static getLocations(): LocationItem[] {
    return getLocal<LocationItem[]>('locations', INITIAL_LOCATIONS);
  }

  static saveLocations(locations: LocationItem[]) {
    setLocal('locations', locations);
  }

  // Testimonials
  static getTestimonials(): Testimonial[] {
    return getLocal<Testimonial[]>('testimonials', INITIAL_TESTIMONIALS);
  }

  static saveTestimonials(testimonials: Testimonial[]) {
    setLocal('testimonials', testimonials);
  }

  // Users
  static getUsers(): UserProfile[] {
    return getLocal<UserProfile[]>('users', INITIAL_USERS);
  }

  static saveUsers(users: UserProfile[]) {
    setLocal('users', users);
  }

  static async saveUser(user: UserProfile): Promise<void> {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...user };
    } else {
      users.push(user);
    }
    setLocal('users', users);

    try {
      await setDoc(doc(db, 'users', user.id), user);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.id}`);
    }
  }

  // Interests / Enquiries
  static getInterests(): Interest[] {
    return getLocal<Interest[]>('interests', INITIAL_INTERESTS);
  }

  static async saveInterest(interest: Interest): Promise<void> {
    const interests = this.getInterests();
    const idx = interests.findIndex(i => i.id === interest.id);
    if (idx >= 0) {
      interests[idx] = interest;
    } else {
      interests.unshift(interest);
    }
    setLocal('interests', interests);

    // Increment vehicle interest count
    const vehicles = this.getVehicles();
    const vIdx = vehicles.findIndex(v => v.id === interest.vehicleId);
    if (vIdx >= 0) {
      vehicles[vIdx].interestCount = (vehicles[vIdx].interestCount || 0) + 1;
      setLocal('vehicles', vehicles);
    }

    try {
      await setDoc(doc(db, 'interests', interest.id), interest);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `interests/${interest.id}`);
    }
  }

  // Favorites
  static getFavorites(): string[] {
    return getLocal<string[]>('favorites', ['veh-swift-1', 'veh-creta-3']);
  }

  static saveFavorites(favs: string[]) {
    setLocal('favorites', favs);
  }

  // Messages & Conversations
  static getConversations(): Conversation[] {
    return getLocal<Conversation[]>('conversations', INITIAL_CONVERSATIONS);
  }

  static saveConversations(conversations: Conversation[]) {
    setLocal('conversations', conversations);
  }

  static getMessages(): Message[] {
    return getLocal<Message[]>('messages', INITIAL_MESSAGES);
  }

  static async saveMessage(message: Message): Promise<void> {
    const messages = this.getMessages();
    messages.push(message);
    setLocal('messages', messages);

    // update conversation
    const conversations = this.getConversations();
    const convIdx = conversations.findIndex(c => c.id === message.conversationId);
    if (convIdx >= 0) {
      conversations[convIdx].lastMessage = message.text;
      conversations[convIdx].lastMessageTime = message.createdAt;
      setLocal('conversations', conversations);
    }

    try {
      await setDoc(doc(db, 'messages', message.id), message);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `messages/${message.id}`);
    }
  }

  // Reports
  static getReports(): ListingReport[] {
    return getLocal<ListingReport[]>('reports', []);
  }

  static saveReports(reports: ListingReport[]) {
    setLocal('reports', reports);
  }

  // Notifications
  static getNotifications(): AppNotification[] {
    return getLocal<AppNotification[]>('notifications', []);
  }

  static saveNotifications(notifications: AppNotification[]) {
    setLocal('notifications', notifications);
  }

  static deleteNotification(id: string) {
    const notifications = this.getNotifications().filter(n => n.id !== id);
    setLocal('notifications', notifications);
  }

  // EMI Leads & Applications
  static getEmiLeads(): EmiLead[] {
    return getLocal<EmiLead[]>('emiLeads', INITIAL_EMI_LEADS);
  }

  static async saveEmiLead(lead: EmiLead): Promise<void> {
    const leads = this.getEmiLeads();
    const idx = leads.findIndex(l => l.id === lead.id);
    if (idx >= 0) {
      leads[idx] = lead;
    } else {
      leads.unshift(lead);
    }
    setLocal('emiLeads', leads);

    try {
      await setDoc(doc(db, 'emi_leads', lead.id), lead);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `emi_leads/${lead.id}`);
    }
  }

  static async deleteEmiLead(id: string): Promise<void> {
    const leads = this.getEmiLeads().filter(l => l.id !== id);
    setLocal('emiLeads', leads);

    try {
      await deleteDoc(doc(db, 'emi_leads', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `emi_leads/${id}`);
    }
  }

  // Settings
  static getSettings(): PlatformSettings {
    return getLocal<PlatformSettings>('settings', INITIAL_PLATFORM_SETTINGS);
  }

  static saveSettings(settings: PlatformSettings) {
    setLocal('settings', settings);
  }

  // Admin Logs
  static getAdminLogs(): AdminLog[] {
    return getLocal<AdminLog[]>('adminLogs', INITIAL_ADMIN_LOGS);
  }

  static addAdminLog(log: AdminLog) {
    const logs = this.getAdminLogs();
    logs.unshift(log);
    setLocal('adminLogs', logs);
  }
}

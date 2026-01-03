
export type UnitType = 'KG' | 'L' | 'Piece';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number; 
  unit: UnitType;
  quantity: number; 
  dateAdded: string;
  image?: string; // Base64 string for offline storage
}

export interface BillItem {
  productId: string;
  name: string;
  basePrice: number;
  unit: UnitType;
  quantity: number; 
  calculatedPrice: number;
}

export interface Bill {
  id: string;
  billNumber: string;
  customerId: string;
  customerName: string;
  customerMobile: string;
  items: BillItem[];
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  date: string;
  time: string;
  status: 'Paid' | 'Partial' | 'Unpaid';
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  address?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export enum AppTab {
  Home = 'home',
  Billing = 'billing',
  Customers = 'customers',
  Inventory = 'inventory',
  BabuRao = 'baburao',
  Settings = 'settings'
}

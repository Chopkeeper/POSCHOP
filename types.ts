export type Page = 'sales' | 'dashboard' | 'products' | 'settings' | 'kitchen' | 'users';

export enum UserRole {
  Admin = 'Admin',
  Cashier = 'Cashier',
  Kitchen = 'Kitchen',
  Server = 'Server',
}

export interface User {
  id: string;
  name: string;
  username: string;
  password?: string; // Password is now part of the user, optional for display
  role: UserRole;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
  description: string;
  prepTimeInMinutes: number; // เวลาที่ใช้เตรียม (นาที)
}

export interface OrderItem extends Product {
  quantity: number;
}

export enum PaymentMethod {
  Cash = 'เงินสด',
  QRCode = 'QR Code',
  CreditCard = 'บัตรเครดิต',
}

export enum OrderStatus {
  New = 'ใหม่',
  Preparing = 'กำลังทำ',
  Ready = 'พร้อมเสิร์ฟ',
  Served = 'เสิร์ฟแล้ว',
  Paid = 'ชำระเงินแล้ว',
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod?: PaymentMethod;
  receivedAmount?: number;
  change?: number;
  createdAt: string;
  cashierId: string; // ID ของพนักงานที่รับออเดอร์
  status: OrderStatus;
  totalPrepTime: number; // เวลารวมที่คำนวณได้
}

export interface Settings {
  storeName: string;
  address: string;
  taxRate: number; // Percentage
  commissionRate: number; // Percentage
}

export interface AppState {
  products: Product[];
  users: User[];
  currentUser: User | null;
  currentOrder: OrderItem[];
  liveOrders: Order[]; // All orders are now live
  settings: Settings;
}

export type Action =
  | { type: 'ADD_TO_ORDER'; payload: Product }
  | { type: 'REMOVE_FROM_ORDER'; payload: string } // productId
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_ORDER' }
  | { type: 'CREATE_ORDER'; payload: Omit<Order, 'id' | 'createdAt' | 'status'> }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: OrderStatus } }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string } // productId
  | { type: 'UPDATE_SETTINGS'; payload: Settings }
  | { type: 'LOGIN'; payload: { username: string; password: string } }
  | { type: 'LOGOUT' }
  | { type: 'ADD_USER'; payload: Omit<User, 'id'> }
  | { type: 'DELETE_USER'; payload: string }; // userId

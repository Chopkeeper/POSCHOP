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
  password?: string;
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
  prepTimeInMinutes: number;
}

export interface OrderItem extends Product {
  quantity: number;
}

export enum OrderStatus {
    New = 'New',
    Preparing = 'Preparing',
    Ready = 'Ready',
    Served = 'Served',
    Paid = 'Paid',
    Cancelled = 'Cancelled'
}

export enum PaymentMethod {
    Cash = 'เงินสด',
    QRCode = 'QR Code',
    CreditCard = 'บัตรเครดิต',
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  receivedAmount?: number;
  change?: number;
  cashierId: string;
  createdAt: string; // ISO string
  status: OrderStatus;
  totalPrepTime: number;
}

export interface Settings {
  storeName: string;
  address: string;
  taxRate: number;
  commissionRate: number;
}

export interface AppState {
  products: Product[];
  users: User[];
  currentUser: User | null;
  currentOrder: OrderItem[];
  liveOrders: Order[];
  settings: Settings;
}

// Action types for the reducer
export type Action =
  // FIX: Corrected a typo in the LOGIN payload type. It should be 'password: string' instead of 'password; string'.
  | { type: 'LOGIN'; payload: { username: string; password: string } }
  | { type: 'LOGOUT' }
  | { type: 'ADD_TO_ORDER'; payload: Product }
  | { type: 'REMOVE_FROM_ORDER'; payload: string } // productId
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_ORDER' }
  | { type: 'CREATE_ORDER'; payload: Omit<Order, 'createdAt'> }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: OrderStatus } }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string } // productId
  | { type: 'UPDATE_SETTINGS'; payload: Settings }
  | { type: 'ADD_USER'; payload: Omit<User, 'id'> }
  | { type: 'DELETE_USER'; payload: string }; // userId
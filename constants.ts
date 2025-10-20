import { Product, Settings, User, UserRole } from './types';

export const CATEGORIES = ['เครื่องดื่ม', 'เบเกอรี่', 'ของว่าง', 'สินค้าทั่วไป', 'อาหารจานหลัก'];

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: 'กาแฟอเมริกาโน่', category: 'เครื่องดื่ม', price: 60, stock: 100, imageUrl: 'https://picsum.photos/id/225/300/200', description: 'กาแฟดำรสเข้มข้น สกัดจากเมล็ดกาแฟอาราบิก้าชั้นดี', prepTimeInMinutes: 3 },
  { id: 'p2', name: 'คาปูชิโน่', category: 'เครื่องดื่ม', price: 75, stock: 80, imageUrl: 'https://picsum.photos/id/369/300/200', description: 'กาแฟนมรสกลมกล่อม พร้อมฟองนมนุ่มละมุน', prepTimeInMinutes: 5 },
  { id: 'p3', name: 'ชาเขียวมัทฉะลาเต้', category: 'เครื่องดื่ม', price: 80, stock: 70, imageUrl: 'https://picsum.photos/id/404/300/200', description: 'มัทฉะแท้จากญี่ปุ่น ผสมนมสด หอมหวานลงตัว', prepTimeInMinutes: 5 },
  { id: 'p4', name: 'ครัวซองต์เนยสด', category: 'เบเกอรี่', price: 55, stock: 50, imageUrl: 'https://picsum.photos/id/326/300/200', description: 'ครัวซองต์อบใหม่ กรอบนอกนุ่มใน หอมเนยฝรั่งเศส', prepTimeInMinutes: 2 },
  { id: 'p5', name: 'เค้กช็อกโกแลต', category: 'เบเกอรี่', price: 95, stock: 30, imageUrl: 'https://picsum.photos/id/1070/300/200', description: 'เค้กช็อกโกแลตเนื้อฉ่ำ เข้มข้นถึงใจ', prepTimeInMinutes: 1 },
  { id: 'p6', name: 'แซนวิชแฮมชีส', category: 'ของว่าง', price: 65, stock: 45, imageUrl: 'https://picsum.photos/id/201/300/200', description: 'แซนวิชอบร้อน อิ่มอร่อยง่ายๆ ได้ประโยชน์', prepTimeInMinutes: 7 },
  { id: 'p7', name: 'น้ำส้มคั้นสด', category: 'เครื่องดื่ม', price: 70, stock: 60, imageUrl: 'https://picsum.photos/id/102/300/200', description: 'น้ำส้มคั้นสด 100% ไม่ผสมน้ำตาล ดีต่อสุขภาพ', prepTimeInMinutes: 4 },
  { id: 'p8', name: 'บราวนี่', category: 'เบเกอรี่', price: 70, stock: 40, imageUrl: 'https://picsum.photos/id/431/300/200', description: 'บราวนี่เนื้อหนึบ เข้มข้นด้วยดาร์กช็อกโกแลต', prepTimeInMinutes: 1 },
  { id: 'p9', name: 'แก้ว Tumbler', category: 'สินค้าทั่วไป', price: 350, stock: 25, imageUrl: 'https://picsum.photos/id/1073/300/200', description: 'แก้วเก็บความเย็นดีไซน์สวยงาม พกพาสะดวก', prepTimeInMinutes: 0 },
  { id: 'p10', name: 'สปาเก็ตตี้คาโบนาร่า', category: 'อาหารจานหลัก', price: 180, stock: 50, imageUrl: 'https://picsum.photos/id/1060/300/200', description: 'สปาเก็ตตี้เส้นเหนียวนุ่ม คลุกเคล้าซอสครีมชีสและเบคอนกรอบ', prepTimeInMinutes: 15 },
  { id: 'p11', name: 'ข้าวผัดกะเพราหมูกรอบ', category: 'อาหารจานหลัก', price: 90, stock: 60, imageUrl: 'https://picsum.photos/id/211/300/200', description: 'รสชาติจัดจ้านถึงเครื่อง หอมกลิ่นใบกะเพราและพริกแห้ง', prepTimeInMinutes: 12 },
];

export const INITIAL_SETTINGS: Settings = {
  storeName: 'ร้านกาแฟ Gemini',
  address: '123 ถนนสุขุมวิท, กรุงเทพมหานคร 10110',
  taxRate: 7,
  commissionRate: 5, // 5% commission
};

export const INITIAL_USERS: User[] = [
    { id: 'user1', name: 'สมชาย (Admin)', username: 'admin', password: '123', role: UserRole.Admin },
    { id: 'user2', name: 'สมศรี (Cashier)', username: 'cashier1', password: '123', role: UserRole.Cashier },
    { id: 'user3', name: 'สมศักดิ์ (Kitchen)', username: 'kitchen1', password: '123', role: UserRole.Kitchen },
    { id: 'user4', name: 'สมหญิง (Server)', username: 'server1', password: '123', role: UserRole.Server },
];

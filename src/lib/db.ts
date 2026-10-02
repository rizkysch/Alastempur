import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data.json');

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  address?: string;
  resetToken?: string;
};

export type Order = {
  id: string;
  userId: string;
  shoeType: string;
  serviceType: string;
  pairs: number;
  notes: string;
  price: number;
  status: 'Pending' | 'Processing' | 'Ready to Pickup' | 'Completed';
  createdAt: string;
  handledBy?: string; // Admin ID
};

export type Admin = {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'Admin' | 'Super Admin';
};

export type ServiceItem = {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  isActive: boolean;
};

export type ContentCMS = {
  phone: string;
  email: string;
  address: string;
  heroText: string;
  aboutText: string;
};

export type Promo = {
  id: string;
  code: string;
  type: 'Percent' | 'Nominal';
  value: number;
  expiryDate: string;
};

type Database = {
  users: User[];
  orders: Order[];
  admins: Admin[];
  services: ServiceItem[];
  cms: ContentCMS;
  promos: Promo[];
};

const defaultDb: Database = { 
  users: [], 
  orders: [],
  admins: [{ id: "SA-1", name: "Super Admin Utama", email: "super@alastempur.com", password: "password123", role: "Super Admin" }],
  services: [
    { id: "S-1", name: "Deep Clean - Sepatu Putih", price: 35000, durationDays: 3, isActive: true },
    { id: "S-2", name: "Fast Clean - Sepatu Putih", price: 25000, durationDays: 1, isActive: true },
  ],
  cms: {
    phone: "0812-3456-7890",
    email: "cs@alastempur.com",
    address: "Jl. Bersih Berkilau No. 123",
    heroText: "Rawat Sepatu Kesayanganmu.",
    aboutText: "Layanan cuci sepatu premium yang cepat, aman, dan terpercaya."
  },
  promos: []
};

export const readDb = (): Database => {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(defaultDb, null, 2));
    return defaultDb;
  }
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    const parsed = JSON.parse(data);
    // Migration: ensure all fields exist even if data.json is from an older version
    return {
      ...defaultDb,
      ...parsed,
      users: parsed.users || defaultDb.users,
      orders: parsed.orders || defaultDb.orders,
      admins: parsed.admins || defaultDb.admins,
      services: parsed.services || defaultDb.services,
      cms: parsed.cms || defaultDb.cms,
      promos: parsed.promos || defaultDb.promos
    };
  } catch (e) {
    return defaultDb;
  }
};

export const writeDb = (data: Database) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

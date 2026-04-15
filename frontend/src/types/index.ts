export interface UserProfile {
  id: string;
  email: string;
  profile: string;
}

export interface Counters {
  totalUsers: number;
  totalProducts: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  profile: string;
  createdAt: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
  createdAt: string;
}

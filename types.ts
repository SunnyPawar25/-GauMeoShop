export interface Product {
  id: number;
  name: string;
  category: 'food' | 'drink' | 'medicine' | 'supplies' | 'toys';
  petType: 'cat' | 'dog' | 'both';
  price: number;
  image: string;
  description: string;
  stock: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: number;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };
}
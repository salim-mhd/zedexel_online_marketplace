export interface Product {
  _id?: string;
  name: string;
  price: number;
  stockQuantity: number;
  category: string;
  status: string;
  vendor: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}
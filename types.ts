
export interface Product {
  id: string;
  name: string;
  price: number;
  slug: string; // Internal ID for logic mapping (e.g., 'coco', 'limao')
  costPrice?: number; // Cost to produce
  promoCost?: number; // Cost during promo
}

export interface FlavorQuantities {
  [key: string]: number;
}

export interface Order {
  id?: string;
  date: string; // ISO string
  customerName: string;
  phone: string;
  address: string;
  deliveryFee: number;
  discount: number;
  flavors: FlavorQuantities;
  total: number;
  type: 'Pedido';
  createdAt: number;
}

export interface Expense {
  id?: string;
  date: string;
  author: string;
  description: string;
  amount: number;
  type: 'Despesa';
  createdAt: number;
}

export interface RawMaterial {
  id?: string;
  name: string;
  unit: string; // '1 L', '1 cx', etc
  price: number;
  promoPrice?: number;
  yield: number; // Rendimento in units
  costPerUnit: number; // Calculated
}

export type Transaction = Order | Expense;

// Map based on the GAS script columns
export const PRODUCT_KEYS = [
  { key: 'coco', label: 'Coco' },
  { key: 'limao', label: 'Limão' },
  { key: 'maracuja', label: 'Maracujá' },
  { key: 'uva', label: 'Uva' },
  { key: 'ceu_azul', label: 'Céu Azul' },
  { key: 'danoninho', label: 'Danoninho' },
  { key: 'oreo', label: 'Oreo' },
  { key: 'pudim', label: 'Pudim' },
  { key: 'pacoquinha', label: 'Paçoquinha' },
  { key: 'ninho_nutella', label: 'Ninho c/ Nutella' },
  { key: 'ninho_morango', label: 'Ninho c/ Morango' },
  { key: 'choco_nutella', label: 'Choco c/ Nutella' },
  { key: 'choco_morango', label: 'Choco c/ Morango' },
];

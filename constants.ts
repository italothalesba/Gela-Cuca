import { Product } from "./types";

// Default pricing structure based on common "Gourmet" vs "Fruit" pricing
// Since the exact prices were in cell K17-K29 in the spreadsheet, 
// we set reasonable defaults that the user can edit later in the database.
export const DEFAULT_PRODUCTS: Product[] = [
  { id: '1', slug: 'coco', name: 'Coco', price: 3.00 },
  { id: '2', slug: 'limao', name: 'Limão', price: 3.00 },
  { id: '3', slug: 'maracuja', name: 'Maracujá', price: 3.00 },
  { id: '4', slug: 'uva', name: 'Uva', price: 3.00 },
  { id: '5', slug: 'ceu_azul', name: 'Céu Azul', price: 3.50 },
  { id: '6', slug: 'danoninho', name: 'Danoninho', price: 3.50 },
  { id: '7', slug: 'oreo', name: 'Oreo', price: 4.00 },
  { id: '8', slug: 'pudim', name: 'Pudim', price: 4.00 },
  { id: '9', slug: 'pacoquinha', name: 'Paçoquinha', price: 3.50 },
  { id: '10', slug: 'ninho_nutella', name: 'Ninho c/ Nutella', price: 5.00 },
  { id: '11', slug: 'ninho_morango', name: 'Ninho c/ Morango', price: 5.00 },
  { id: '12', slug: 'choco_nutella', name: 'Choco c/ Nutella', price: 5.00 },
  { id: '13', slug: 'choco_morango', name: 'Choco c/ Morango', price: 5.00 },
];
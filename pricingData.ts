
import { RawMaterial, Product } from './types';

// Dados extraídos fielmente do PDF (OCR) para importação em lote
export const INITIAL_RAW_MATERIALS: RawMaterial[] = [
  { name: 'Leite', unit: '1 L', price: 4.00, promoPrice: 4.00, yield: 13, costPerUnit: 0.31 },
  { name: 'Leite condensado', unit: '1 cx', price: 3.28, promoPrice: 3.39, yield: 13, costPerUnit: 0.25 },
  { name: 'Creme de leite', unit: '1 cx', price: 1.99, promoPrice: 1.80, yield: 13, costPerUnit: 0.15 },
  { name: 'Saco de dindin', unit: '1000 un', price: 84.00, promoPrice: 4.00, yield: 1000, costPerUnit: 0.08 },
  { name: 'Liga', unit: '100 un', price: 2.00, promoPrice: 2.00, yield: 95, costPerUnit: 0.02 },
  { name: 'Liga Neutra', unit: '1000 g', price: 23.00, promoPrice: 20.00, yield: 800, costPerUnit: 0.03 },
  { name: 'Nutella', unit: '650g', price: 38.89, promoPrice: 36.00, yield: 60, costPerUnit: 0.65 },
  { name: 'Oreo', unit: '1 pc', price: 8.09, promoPrice: 10.00, yield: 30, costPerUnit: 0.27 },
  { name: 'Coco', unit: '1000g', price: 29.45, promoPrice: 5.77, yield: 87, costPerUnit: 0.34 },
  { name: 'Frisco', unit: '2 pc', price: 1.40, promoPrice: 1.20, yield: 13, costPerUnit: 0.11 },
  { name: 'Paçoquinha', unit: '54 un', price: 31.49, promoPrice: 28.00, yield: 63, costPerUnit: 0.50 },
  { name: 'Morango', unit: '1000g', price: 20.00, promoPrice: 7.50, yield: 60, costPerUnit: 0.33 },
  { name: 'Leite em pó', unit: '1000 g', price: 35.99, promoPrice: 29.90, yield: 109, costPerUnit: 0.33 },
  { name: 'Chocolate em pó', unit: '2000g', price: 29.00, promoPrice: 28.00, yield: 221, costPerUnit: 0.13 },
  { name: 'Adesivo', unit: '570', price: 39.00, promoPrice: 3.00, yield: 570, costPerUnit: 0.07 },
  { name: 'Saco Pack', unit: '300 un', price: 28.00, promoPrice: 26.77, yield: 300, costPerUnit: 0.09 },
  { name: 'Essên. Baunilha', unit: '960 ml', price: 12.00, promoPrice: 10.00, yield: 768, costPerUnit: 0.02 },
  { name: 'Açucar cristal', unit: '1000 g', price: 4.00, promoPrice: 4.00, yield: 80, costPerUnit: 0.05 },
  { name: 'Ovo', unit: '30 un', price: 15.00, promoPrice: 9.00, yield: 360, costPerUnit: 0.04 },
  { name: 'Blue Ice', unit: '1000 g', price: 27.35, promoPrice: 23.00, yield: 300, costPerUnit: 0.09 },
  { name: 'Maracujá', unit: '1', price: 2.25, promoPrice: 1.50, yield: 13, costPerUnit: 0.17 },
];

export const INITIAL_FLAVOR_COSTS = [
  // Base cost is derived, skipping "Base" entry to keep products list clean for POS
  { slug: 'coco', costPrice: 1.25, promoCost: 0.83, price: 4.00 },
  { slug: 'limao', costPrice: 1.02, promoCost: 0.85, price: 4.00 },
  { slug: 'maracuja', costPrice: 1.25, promoCost: 1.02, price: 4.00 },
  { slug: 'uva', costPrice: 1.02, promoCost: 0.85, price: 3.00 },
  { slug: 'ceu_azul', costPrice: 1.01, promoCost: 0.84, price: 3.00 },
  { slug: 'danoninho', costPrice: 1.02, promoCost: 0.85, price: 3.00 },
  { slug: 'oreo', costPrice: 1.32, promoCost: 1.22, price: 5.00 },
  { slug: 'pudim', costPrice: 1.29, promoCost: 1.08, price: 5.00 },
  { slug: 'pacoquinha', costPrice: 1.42, promoCost: 1.26, price: 5.00 },
  { slug: 'ninho_nutella', costPrice: 1.89, promoCost: 1.64, price: 5.00 },
  { slug: 'ninho_morango', costPrice: 1.58, promoCost: 1.16, price: 5.00 },
  { slug: 'choco_nutella', costPrice: 1.69, promoCost: 1.49, price: 5.00 },
  { slug: 'choco_morango', costPrice: 1.38, promoCost: 1.01, price: 5.00 },
];

import { FlavorQuantities, Product, PRODUCT_KEYS } from './types';

// Logic derived from the Google Apps Script "valorAutomatico" function
export const calculateOrderTotal = (
  flavors: FlavorQuantities,
  deliveryFee: number,
  discount: number,
  products: Product[]
): number => {
  let subtotal = 0;

  // Calculate product costs
  PRODUCT_KEYS.forEach((prodKey) => {
    const qty = flavors[prodKey.key] || 0;
    const productDef = products.find(p => p.slug === prodKey.key);
    const price = productDef ? productDef.price : 0;
    
    subtotal += qty * price;
  });

  // Add delivery fee
  let total = subtotal + (deliveryFee || 0);

  // Subtract discount
  total = total - (discount || 0);

  return Math.max(0, total); // Prevent negative total
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const getCurrentDateISO = () => {
  return new Date().toISOString().split('T')[0];
};
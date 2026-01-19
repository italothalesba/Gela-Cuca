import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Plus, Minus, Save, User, MapPin, Phone, Truck, Percent, Search } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Product, FlavorQuantities, PRODUCT_KEYS, Order } from '../types';
import { calculateOrderTotal, formatCurrency, getCurrentDateISO } from '../utils';

interface POSProps {
  products: Product[];
  orders: Order[];
  onOrderAdded: () => void;
}

interface SimpleCustomer {
  name: string;
  phone: string;
  address: string;
}

const POS: React.FC<POSProps> = ({ products, orders, onOrderAdded }) => {
  const [loading, setLoading] = useState(false);
  
  // Customer Data
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState(getCurrentDateISO());

  // Autocomplete State
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // Order Data
  const [flavors, setFlavors] = useState<FlavorQuantities>({});
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  // Extract unique customers from order history (Most recent orders first)
  const uniqueCustomers = useMemo(() => {
    const map = new Map<string, SimpleCustomer>();
    orders.forEach(order => {
      const cleanName = order.customerName.trim();
      if (cleanName && !map.has(cleanName.toLowerCase())) {
        map.set(cleanName.toLowerCase(), {
          name: cleanName,
          phone: order.phone || '',
          address: order.address || ''
        });
      }
    });
    return Array.from(map.values());
  }, [orders]);

  // Filter suggestions based on input
  const suggestions = useMemo(() => {
    if (!customerName || customerName.length < 2) return [];
    const term = customerName.toLowerCase();
    return uniqueCustomers
      .filter(c => c.name.toLowerCase().includes(term))
      .slice(0, 5); // Limit to 5 suggestions
  }, [customerName, uniqueCustomers]);

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Recalculate total whenever inputs change
  useEffect(() => {
    const newTotal = calculateOrderTotal(flavors, deliveryFee, discount, products);
    setTotal(newTotal);
  }, [flavors, deliveryFee, discount, products]);

  const updateQuantity = (key: string, delta: number) => {
    setFlavors(prev => {
      const current = prev[key] || 0;
      const newVal = Math.max(0, current + delta);
      return { ...prev, [key]: newVal };
    });
  };

  const handleSelectCustomer = (customer: SimpleCustomer) => {
    setCustomerName(customer.name);
    setPhone(customer.phone);
    setAddress(customer.address);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName) {
      alert("Por favor, insira o nome do cliente.");
      return;
    }
    
    setLoading(true);
    try {
      await addDoc(collection(db, "orders"), {
        date,
        customerName,
        phone,
        address,
        flavors,
        deliveryFee,
        discount,
        total,
        type: 'Pedido',
        createdAt: Date.now()
      });

      // Reset Form
      setCustomerName('');
      setPhone('');
      setAddress('');
      setFlavors({});
      setDeliveryFee(0);
      setDiscount(0);
      alert("Pedido salvo com sucesso!");
      onOrderAdded();
    } catch (error) {
      console.error("Erro ao salvar pedido: ", error);
      alert("Erro ao salvar pedido. Verifique o console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Novo Pedido</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Info Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
            <User size={20} className="mr-2" /> Dados do Cliente
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
              />
            </div>
            
            {/* Customer Name with Autocomplete */}
            <div className="relative" ref={wrapperRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={customerName} 
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Nome do cliente"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  required
                  autoComplete="off"
                />
                 {customerName && suggestions.length === 0 && (
                   <div className="absolute right-3 top-2.5 text-gray-400 pointer-events-none">
                     <User size={16} />
                   </div>
                 )}
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <ul>
                    {suggestions.map((customer, index) => (
                      <li 
                        key={index}
                        onClick={() => handleSelectCustomer(customer)}
                        className="px-4 py-3 hover:bg-rose-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                      >
                        <div className="font-medium text-gray-800">{customer.name}</div>
                        {(customer.address || customer.phone) && (
                          <div className="text-xs text-gray-500 flex items-center mt-1">
                             {customer.phone && <span className="mr-3 flex items-center"><Phone size={10} className="mr-1"/> {customer.phone}</span>}
                             {customer.address && <span className="flex items-center"><MapPin size={10} className="mr-1"/> {customer.address}</span>}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-400" size={16} />
                <input 
                  type="text" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                <input 
                  type="text" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rua, Número, Bairro"
                  className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Flavors Grid */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-purple-900 mb-4">Sabores</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {PRODUCT_KEYS.map((item) => {
              const qty = flavors[item.key] || 0;
              const product = products.find(p => p.slug === item.key);
              const price = product ? product.price : 0;

              return (
                <div key={item.key} className="flex flex-col p-3 border border-gray-200 rounded-lg hover:border-rose-300 transition-colors">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-800">{item.label}</span>
                    <span className="text-sm text-gray-500">{formatCurrency(price)}</span>
                  </div>
                  <div className="flex items-center justify-between bg-purple-50 rounded-lg p-1">
                    <button 
                      type="button"
                      onClick={() => updateQuantity(item.key, -1)}
                      className="p-2 text-gray-600 hover:text-red-500 hover:bg-white rounded-md transition-all"
                      disabled={qty === 0}
                    >
                      <Minus size={16} />
                    </button>
                    <span className={`font-bold w-8 text-center ${qty > 0 ? 'text-rose-600' : 'text-gray-400'}`}>
                      {qty}
                    </span>
                    <button 
                      type="button"
                      onClick={() => updateQuantity(item.key, 1)}
                      className="p-2 text-gray-600 hover:text-green-500 hover:bg-white rounded-md transition-all"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Totals & Fees */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Taxa de Entrega</label>
              <div className="relative">
                <Truck className="absolute left-3 top-3 text-gray-400" size={16} />
                <input 
                  type="number" 
                  value={deliveryFee} 
                  onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)}
                  className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Desconto</label>
              <div className="relative">
                <Percent className="absolute left-3 top-3 text-gray-400" size={16} />
                <input 
                  type="number" 
                  value={discount} 
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none text-red-600"
                />
              </div>
            </div>
            <div className="flex flex-col justify-end">
               <div className="flex justify-between items-end p-4 bg-rose-50 rounded-lg border border-rose-100">
                 <span className="text-rose-800 font-medium">Total do Pedido</span>
                 <span className="text-2xl font-bold text-rose-900">{formatCurrency(total)}</span>
               </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="sticky bottom-4 z-10">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 px-6 rounded-xl shadow-lg flex items-center justify-center text-white font-bold text-lg transition-transform transform active:scale-95 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-rose-500 to-orange-400 hover:from-rose-600 hover:to-orange-500"
            }`}
          >
            {loading ? 'Salvando...' : (
              <>
                <Save className="mr-2" size={24} />
                Finalizar Pedido ({formatCurrency(total)})
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default POS;
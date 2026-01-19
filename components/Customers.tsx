import React, { useState, useMemo } from 'react';
import { Order } from '../types';
import { formatCurrency } from '../utils';
import { Search, Phone, MapPin, User, ChevronRight, X, Calendar, DollarSign, ShoppingBag } from 'lucide-react';

interface CustomersProps {
  orders: Order[];
}

interface AggregatedCustomer {
  name: string;
  phone: string;
  address: string;
  totalSpent: number;
  orderCount: number;
  lastOrderDate: string;
  history: Order[];
}

const Customers: React.FC<CustomersProps> = ({ orders }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<AggregatedCustomer | null>(null);

  // Aggregate orders by customer name
  const customers = useMemo(() => {
    const map = new Map<string, AggregatedCustomer>();

    // Sort orders by date (oldest to newest) to ensure we get the latest address/phone eventually
    const sortedOrders = [...orders].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sortedOrders.forEach(order => {
      const normalizedName = order.customerName.trim();
      if (!normalizedName) return;

      const existing = map.get(normalizedName.toLowerCase());

      if (existing) {
        existing.totalSpent += order.total;
        existing.orderCount += 1;
        existing.lastOrderDate = order.date; // updating with newer date
        if (order.phone) existing.phone = order.phone; // update with latest phone
        if (order.address) existing.address = order.address; // update with latest address
        existing.history.push(order);
      } else {
        map.set(normalizedName.toLowerCase(), {
          name: normalizedName,
          phone: order.phone || '',
          address: order.address || '',
          totalSpent: order.total,
          orderCount: 1,
          lastOrderDate: order.date,
          history: [order]
        });
      }
    });

    // Convert to array and sort by total spent (VIPs first)
    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Clientes</h2>
          <p className="text-gray-500 text-sm">Baseado no histórico de {orders.length} pedidos</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-purple-50 text-purple-900 font-medium text-sm uppercase tracking-wider">
              <tr>
                <th className="p-4">Cliente</th>
                <th className="p-4">Contato</th>
                <th className="p-4 hidden md:table-cell">Última Compra</th>
                <th className="p-4 text-center">Pedidos</th>
                <th className="p-4 text-right">Total Gasto</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((customer, idx) => (
                <tr 
                  key={idx} 
                  onClick={() => setSelectedCustomer(customer)}
                  className="hover:bg-rose-50 transition-colors cursor-pointer group"
                >
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold mr-3 group-hover:bg-rose-200 group-hover:text-rose-700 transition-colors">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-800">{customer.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {customer.phone ? (
                      <div className="flex items-center gap-1">
                        <Phone size={14} className="text-gray-400"/> {customer.phone}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">Sem telefone</span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-gray-600 hidden md:table-cell">
                    {new Date(customer.lastOrderDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-block px-2 py-1 bg-gray-100 rounded-md text-xs font-semibold text-gray-600">
                      {customer.orderCount}
                    </span>
                  </td>
                  <td className="p-4 text-right font-bold text-gray-800">
                    {formatCurrency(customer.totalSpent)}
                  </td>
                  <td className="p-4 text-gray-400">
                    <ChevronRight size={20} />
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-purple-50 rounded-t-2xl">
              <div>
                <h3 className="text-2xl font-bold text-purple-900 flex items-center gap-2">
                  <User className="text-rose-500" /> {selectedCustomer.name}
                </h3>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                  {selectedCustomer.phone && (
                    <span className="flex items-center gap-1"><Phone size={14}/> {selectedCustomer.phone}</span>
                  )}
                  {selectedCustomer.address && (
                    <span className="flex items-center gap-1"><MapPin size={14}/> {selectedCustomer.address}</span>
                  )}
                </div>
              </div>
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="p-2 hover:bg-white rounded-full transition-colors text-gray-500 hover:text-red-500"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Stats */}
            <div className="grid grid-cols-3 gap-4 p-6 border-b border-gray-100">
                <div className="bg-rose-50 p-4 rounded-xl text-center">
                    <p className="text-xs font-bold text-rose-400 uppercase tracking-wide">Total Gasto</p>
                    <p className="text-xl font-bold text-rose-600 mt-1">{formatCurrency(selectedCustomer.totalSpent)}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl text-center">
                    <p className="text-xs font-bold text-purple-400 uppercase tracking-wide">Pedidos</p>
                    <p className="text-xl font-bold text-purple-600 mt-1">{selectedCustomer.orderCount}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl text-center">
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-wide">Ticket Médio</p>
                    <p className="text-xl font-bold text-blue-600 mt-1">
                        {formatCurrency(selectedCustomer.totalSpent / selectedCustomer.orderCount)}
                    </p>
                </div>
            </div>

            {/* Modal History List */}
            <div className="flex-1 overflow-y-auto p-6">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                <ShoppingBag size={18} className="mr-2 text-gray-400"/> Histórico de Compras
              </h4>
              <div className="space-y-3">
                {[...selectedCustomer.history].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((order) => {
                    const itemCount = (Object.values(order.flavors) as number[]).reduce((a, b) => a + b, 0);
                    return (
                        <div key={order.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-lg hover:border-rose-200 hover:bg-rose-50 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="bg-gray-100 p-2 rounded-lg">
                                    <Calendar size={20} className="text-gray-500"/>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">{new Date(order.date).toLocaleDateString('pt-BR')}</p>
                                    <p className="text-sm text-gray-500">{itemCount} itens</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-purple-700">{formatCurrency(order.total)}</p>
                            </div>
                        </div>
                    );
                })}
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 text-center">
                <button 
                    onClick={() => setSelectedCustomer(null)}
                    className="text-gray-500 hover:text-gray-800 text-sm font-medium"
                >
                    Fechar Detalhes
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
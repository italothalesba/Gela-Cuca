import React from 'react';
import { Order } from '../types';
import { formatCurrency } from '../utils';

interface OrdersListProps {
  orders: Order[];
}

const OrdersList: React.FC<OrdersListProps> = ({ orders }) => {
  // Sort by date desc
  const sortedOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Histórico de Pedidos</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium text-sm uppercase tracking-wider">
            <tr>
              <th className="p-4">Data</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Telefone</th>
              <th className="p-4">Itens</th>
              <th className="p-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedOrders.map((order) => {
               // Cast to number[] to ensure TS infers types correctly for reduce
               const itemCount = (Object.values(order.flavors) as number[]).reduce((a, b) => a + b, 0);
               return (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-600 text-sm">{new Date(order.date).toLocaleDateString('pt-BR')}</td>
                  <td className="p-4 font-medium text-gray-800">{order.customerName}</td>
                  <td className="p-4 text-gray-500 text-sm">{order.phone}</td>
                  <td className="p-4 text-gray-500 text-sm">{itemCount} und.</td>
                  <td className="p-4 text-right font-bold text-purple-600">{formatCurrency(order.total)}</td>
                </tr>
               );
            })}
            {sortedOrders.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400">
                  Nenhum pedido encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersList;
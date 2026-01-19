import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Expense } from '../types';
import { formatCurrency, getCurrentDateISO } from '../utils';
import { PlusCircle } from 'lucide-react';

interface ExpenseTrackerProps {
  expenses: Expense[];
  onUpdate: () => void;
}

const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({ expenses, onUpdate }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [author, setAuthor] = useState('');
  const [date, setDate] = useState(getCurrentDateISO());
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !author) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "expenses"), {
        description,
        amount: parseFloat(amount),
        author,
        date,
        type: 'Despesa',
        createdAt: Date.now()
      });
      setDescription('');
      setAmount('');
      setAuthor('');
      onUpdate();
    } catch (error) {
      console.error("Error adding expense", error);
    } finally {
      setLoading(false);
    }
  };

  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Nova Despesa</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <input 
                type="text" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Compra de leite"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
              <input 
                type="number" 
                step="0.01"
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Autor (Quem gastou)</label>
              <input 
                type="text" 
                value={author} 
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Nome"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg flex items-center justify-center transition-colors"
            >
              <PlusCircle className="mr-2" size={20} />
              {loading ? 'Salvando...' : 'Adicionar Despesa'}
            </button>
          </form>
        </div>
      </div>

      {/* List */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">Histórico de Despesas</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-red-50 text-red-800 font-medium text-sm uppercase">
                <tr>
                  <th className="p-4">Data</th>
                  <th className="p-4">Descrição</th>
                  <th className="p-4">Autor</th>
                  <th className="p-4 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-gray-50">
                    <td className="p-4 text-sm text-gray-600">{new Date(exp.date).toLocaleDateString('pt-BR')}</td>
                    <td className="p-4 text-gray-800">{exp.description}</td>
                    <td className="p-4 text-sm text-gray-500">{exp.author}</td>
                    <td className="p-4 text-right font-bold text-red-500">- {formatCurrency(exp.amount)}</td>
                  </tr>
                ))}
                 {sortedExpenses.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-400">
                      Nenhuma despesa registrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;
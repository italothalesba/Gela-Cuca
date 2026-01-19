import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { Product, Order, Expense } from './types';
import { DEFAULT_PRODUCTS } from './constants';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import POS from './components/POS';
import OrdersList from './components/OrdersList';
import ExpenseTracker from './components/ExpenseTracker';
import Settings from './components/Settings';
import Customers from './components/Customers';
import Pricing from './components/Pricing';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data State
  const [orders, setOrders] = useState<Order[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS); 

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Data Realtime
  useEffect(() => {
    if (!user) return;

    // Fetch Orders
    const ordersQ = query(collection(db, "orders"), orderBy("date", "desc"));
    const unsubOrders = onSnapshot(ordersQ, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      setOrders(data);
    });

    // Fetch Expenses
    const expensesQ = query(collection(db, "expenses"), orderBy("date", "desc"));
    const unsubExpenses = onSnapshot(expensesQ, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense));
      setExpenses(data);
    });

    // Fetch Products (Pricing)
    // If empty in DB, it will stay empty until Pricing component initializes it.
    // If not empty, we use DB products to render POS prices correctly.
    const unsubProducts = onSnapshot(collection(db, "products"), (snapshot) => {
        if (!snapshot.empty) {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
            setProducts(data);
        }
    });

    return () => {
      unsubOrders();
      unsubExpenses();
      unsubProducts();
    };
  }, [user]);

  if (loadingAuth) {
    return <div className="min-h-screen flex items-center justify-center text-rose-500">Carregando...</div>;
  }

  if (!user) {
    return <Login />;
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard orders={orders} expenses={expenses} />;
      case 'pos':
        return <POS products={products} orders={orders} onOrderAdded={() => setCurrentPage('orders')} />;
      case 'orders':
        return <OrdersList orders={orders} />;
      case 'customers':
        return <Customers orders={orders} />;
      case 'pricing':
        return <Pricing />;
      case 'expenses':
        return <ExpenseTracker expenses={expenses} onUpdate={() => {}} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard orders={orders} expenses={expenses} />;
    }
  };

  return (
    <div className="flex h-screen bg-purple-50 overflow-hidden">
      <Sidebar 
        currentPage={currentPage} 
        setPage={setCurrentPage} 
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white shadow-sm p-4 flex items-center justify-between z-10">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
            <Menu size={24} />
          </button>
          <span className="font-bold text-gray-800">Gela Cuca</span>
          <div className="w-6"></div> {/* Spacer */}
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
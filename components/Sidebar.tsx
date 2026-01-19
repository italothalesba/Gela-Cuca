import React from 'react';
import { LayoutDashboard, ShoppingCart, Receipt, List, LogOut, IceCream, Settings, Users, Calculator } from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';

interface SidebarProps {
  currentPage: string;
  setPage: (page: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setPage, isOpen, setIsOpen }) => {
  const auth = getAuth();

  const handleLogout = () => {
    signOut(auth).catch((error) => console.error("Error signing out", error));
  };

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'pos', icon: ShoppingCart, label: 'Novo Pedido' },
    { id: 'orders', icon: List, label: 'Histórico' },
    { id: 'customers', icon: Users, label: 'Clientes' },
    { id: 'pricing', icon: Calculator, label: 'Precificação' },
    { id: 'expenses', icon: Receipt, label: 'Despesas' },
    { id: 'settings', icon: Settings, label: 'Configurações' },
  ];

  const sidebarClass = `fixed inset-y-0 left-0 transform ${
    isOpen ? "translate-x-0" : "-translate-x-full"
  } md:relative md:translate-x-0 transition duration-200 ease-in-out z-30 w-64 bg-white border-r border-gray-200 shadow-lg md:shadow-none flex flex-col`;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <div className={sidebarClass}>
        <div className="p-6 flex items-center justify-center border-b border-gray-100 bg-purple-100">
          <IceCream className="text-rose-500 mr-2" size={28} />
          <h1 className="text-xl font-bold text-purple-900">Gela Cuca</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setPage(item.id);
                setIsOpen(false);
              }}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-150 ${
                currentPage === item.id
                  ? "bg-rose-500 text-white shadow-md shadow-rose-200"
                  : "text-gray-600 hover:bg-rose-50 hover:text-rose-600"
              }`}
            >
              <item.icon className="mr-3" size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut className="mr-3" size={20} />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
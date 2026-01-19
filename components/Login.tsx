import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { IceCream } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error(err);
      setError('Falha no login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-purple-50">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4 text-rose-500">
            <IceCream size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Gela Cuca Manager</h1>
          <p className="text-gray-500">Faça login para acessar o sistema</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
              placeholder="seu@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-lg transition-colors shadow-md shadow-rose-200"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
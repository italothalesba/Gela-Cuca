import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, writeBatch, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { RawMaterial, Product, PRODUCT_KEYS } from '../types';
import { INITIAL_RAW_MATERIALS, INITIAL_FLAVOR_COSTS } from '../pricingData';
import { formatCurrency } from '../utils';
import { Trash2, Save, RefreshCw, AlertCircle, TrendingUp, Archive, Tags, DownloadCloud, Loader2 } from 'lucide-react';

const Pricing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'materials' | 'flavors'>('materials');
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);

  // --- Data Fetching ---
  useEffect(() => {
    const unsubMaterials = onSnapshot(collection(db, "raw_materials"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RawMaterial));
      setMaterials(data);
    });

    const unsubProducts = onSnapshot(collection(db, "products"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(data);
    });

    setLoading(false);
    return () => {
      unsubMaterials();
      unsubProducts();
    };
  }, []);

  // --- Actions ---

  const handleImportDefaults = async () => {
    if (!window.confirm("Confirmar importação em lote dos dados do PDF? Isso atualizará valores existentes e criará novos itens.")) return;
    
    setImporting(true);
    try {
      const batch = writeBatch(db);
      let updatedCount = 0;
      let createdCount = 0;
      
      // 1. Import Raw Materials (Smart Upsert)
      INITIAL_RAW_MATERIALS.forEach(initMat => {
        // Check if material already exists by name (case insensitive)
        const existing = materials.find(m => m.name.toLowerCase() === initMat.name.toLowerCase());
        
        if (existing && existing.id) {
          // Update existing
          const ref = doc(db, "raw_materials", existing.id);
          batch.update(ref, { 
            price: initMat.price,
            promoPrice: initMat.promoPrice,
            yield: initMat.yield,
            costPerUnit: initMat.costPerUnit,
            unit: initMat.unit
          });
          updatedCount++;
        } else {
          // Create new
          const ref = doc(collection(db, "raw_materials"));
          batch.set(ref, initMat);
          createdCount++;
        }
      });

      // 2. Import Flavor Costs (Smart Upsert)
      INITIAL_FLAVOR_COSTS.forEach(flavorCost => {
          // Find existing product by slug
          const existing = products.find(p => p.slug === flavorCost.slug);
          const productData = {
              slug: flavorCost.slug,
              name: PRODUCT_KEYS.find(k => k.key === flavorCost.slug)?.label || flavorCost.slug,
              price: flavorCost.price,
              costPrice: flavorCost.costPrice,
              promoCost: flavorCost.promoCost
          };

          if (existing && existing.id) {
              const ref = doc(db, "products", existing.id);
              batch.update(ref, productData);
              updatedCount++;
          } else {
               const ref = doc(collection(db, "products"));
               batch.set(ref, productData);
               createdCount++;
          }
      });

      await batch.commit();
      alert(`Importação concluída!\n${createdCount} novos itens criados.\n${updatedCount} itens atualizados.`);
    } catch (error) {
      console.error("Erro na importação:", error);
      alert("Erro ao importar dados. Verifique o console.");
    } finally {
      setImporting(false);
    }
  };

  // --- Materials Tab Logic ---
  const [newMaterial, setNewMaterial] = useState<Partial<RawMaterial>>({
    name: '', unit: '', price: 0, yield: 1
  });

  const addMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterial.name || !newMaterial.price || !newMaterial.yield) return;

    const costPerUnit = (newMaterial.price || 0) / (newMaterial.yield || 1);
    await addDoc(collection(db, "raw_materials"), {
      ...newMaterial,
      costPerUnit
    });
    setNewMaterial({ name: '', unit: '', price: 0, yield: 1 });
  };

  const deleteMaterial = async (id: string) => {
    if (window.confirm("Deletar este item?")) {
      await deleteDoc(doc(db, "raw_materials", id));
    }
  };

  // --- Flavors Tab Logic ---
  const updateProductCost = async (id: string, field: string, value: string) => {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return;
      
      await setDoc(doc(db, "products", id), { [field]: numValue }, { merge: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Precificação</h2>
          <p className="text-sm text-gray-500">Gerencie custos de produção e margens de lucro</p>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
           <button
             onClick={handleImportDefaults}
             disabled={importing}
             className="px-4 py-2 rounded-md text-sm font-bold flex items-center bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-200 disabled:opacity-50 transition-colors"
             title="Clique para importar/atualizar todos os dados do PDF"
           >
             {importing ? <Loader2 size={16} className="animate-spin mr-2"/> : <DownloadCloud size={16} className="mr-2"/>}
             {importing ? 'Processando...' : 'Importar Lote (PDF)'}
           </button>

           <div className="flex bg-white p-1 rounded-lg border border-purple-100">
             <button
               onClick={() => setActiveTab('materials')}
               className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${activeTab === 'materials' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-purple-50'}`}
             >
               <Archive size={16} className="mr-2"/> Matéria-Prima
             </button>
             <button
               onClick={() => setActiveTab('flavors')}
               className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${activeTab === 'flavors' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-purple-50'}`}
             >
               <Tags size={16} className="mr-2"/> Sabores
             </button>
           </div>
        </div>
      </div>

      {activeTab === 'materials' && (
        <div className="space-y-6">
           {/* Add New Material */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="font-bold text-gray-800 mb-4">Adicionar Novo Insumo</h3>
             <form onSubmit={addMaterial} className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end">
               <div className="col-span-2 md:col-span-1">
                 <label className="text-xs text-gray-500 font-medium">Nome</label>
                 <input 
                   type="text" 
                   value={newMaterial.name}
                   onChange={e => setNewMaterial({...newMaterial, name: e.target.value})}
                   className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                   placeholder="Ex: Leite" required
                 />
               </div>
               <div>
                 <label className="text-xs text-gray-500 font-medium">Unidade</label>
                 <input 
                   type="text" 
                   value={newMaterial.unit}
                   onChange={e => setNewMaterial({...newMaterial, unit: e.target.value})}
                   className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                   placeholder="1 L"
                 />
               </div>
               <div>
                 <label className="text-xs text-gray-500 font-medium">Preço Pago (R$)</label>
                 <input 
                   type="number" step="0.01"
                   value={newMaterial.price || ''}
                   onChange={e => setNewMaterial({...newMaterial, price: parseFloat(e.target.value)})}
                   className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                   placeholder="0.00" required
                 />
               </div>
               <div>
                 <label className="text-xs text-gray-500 font-medium">Rendimento (Un)</label>
                 <input 
                   type="number" step="0.01"
                   value={newMaterial.yield || ''}
                   onChange={e => setNewMaterial({...newMaterial, yield: parseFloat(e.target.value)})}
                   className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                   placeholder="1" required
                 />
               </div>
               <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-600 font-bold flex justify-center items-center h-10">
                 <Save size={20} />
               </button>
             </form>
           </div>

           {/* Table */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <table className="w-full text-left">
               <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-bold">
                 <tr>
                   <th className="p-4">Matéria-Prima</th>
                   <th className="p-4">Unidade</th>
                   <th className="p-4">Valor Pago</th>
                   <th className="p-4">Rendimento</th>
                   <th className="p-4 bg-purple-50 text-purple-800">Custo Unit. (R$/UN)</th>
                   <th className="p-4 text-center">Ações</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {materials.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-400">
                            Nenhuma matéria-prima cadastrada. Use o botão <b>"Importar Lote (PDF)"</b> acima.
                        </td>
                    </tr>
                 ) : (
                     materials.map(mat => (
                       <tr key={mat.id} className="hover:bg-gray-50">
                         <td className="p-4 font-medium">{mat.name}</td>
                         <td className="p-4 text-sm text-gray-500">{mat.unit}</td>
                         <td className="p-4">{formatCurrency(mat.price)}</td>
                         <td className="p-4 text-sm">{mat.yield}</td>
                         <td className="p-4 font-bold text-purple-700 bg-purple-50">{formatCurrency(mat.price / mat.yield)}</td>
                         <td className="p-4 text-center">
                            <button 
                              onClick={() => mat.id && deleteMaterial(mat.id)}
                              className="text-red-400 hover:text-red-600"
                            >
                              <Trash2 size={18} />
                            </button>
                         </td>
                       </tr>
                     ))
                 )}
               </tbody>
             </table>
           </div>
        </div>
      )}

      {activeTab === 'flavors' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 bg-yellow-50 text-yellow-800 text-sm border-b border-yellow-100">
              <p><b>Dica:</b> O "Preço Final" aqui atualiza o preço no formulário de Novo Pedido.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-bold">
                  <tr>
                    <th className="p-4">Sabor</th>
                    <th className="p-4 w-32">Custo (Base)</th>
                    <th className="p-4 w-32">Custo (Promo)</th>
                    <th className="p-4 w-32">Preço Venda</th>
                    <th className="p-4">Lucro (R$)</th>
                    <th className="p-4">Margem (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.length === 0 ? (
                     <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-400">
                            Nenhum produto cadastrada. Use o botão <b>"Importar Lote (PDF)"</b> acima.
                        </td>
                    </tr>
                  ) : (
                      products.map(prod => {
                        const cost = prod.costPrice || 0;
                        const price = prod.price || 0;
                        const profit = price - cost;
                        const margin = cost > 0 ? ((profit / cost) * 100) : 0;
                        
                        return (
                          <tr key={prod.id} className="hover:bg-gray-50">
                            <td className="p-4 font-bold text-gray-800">{prod.name}</td>
                            <td className="p-4">
                              <div className="flex items-center bg-white border border-gray-200 rounded px-2">
                                 <span className="text-gray-400 text-xs mr-1">R$</span>
                                 <input 
                                   type="number" step="0.01"
                                   className="w-full py-1 outline-none text-sm"
                                   defaultValue={prod.costPrice}
                                   onBlur={(e) => prod.id && updateProductCost(prod.id, 'costPrice', e.target.value)}
                                 />
                              </div>
                            </td>
                             <td className="p-4">
                              <div className="flex items-center bg-white border border-gray-200 rounded px-2">
                                 <span className="text-gray-400 text-xs mr-1">R$</span>
                                 <input 
                                   type="number" step="0.01"
                                   className="w-full py-1 outline-none text-sm text-gray-500"
                                   defaultValue={prod.promoCost}
                                   onBlur={(e) => prod.id && updateProductCost(prod.id, 'promoCost', e.target.value)}
                                 />
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center bg-white border border-purple-200 rounded px-2 ring-1 ring-transparent focus-within:ring-purple-400">
                                 <span className="text-purple-600 text-xs mr-1 font-bold">R$</span>
                                 <input 
                                   type="number" step="0.01"
                                   className="w-full py-1 outline-none text-sm font-bold text-purple-900"
                                   defaultValue={prod.price}
                                   onBlur={(e) => prod.id && updateProductCost(prod.id, 'price', e.target.value)}
                                 />
                              </div>
                            </td>
                            <td className="p-4 font-medium text-green-600">
                               {formatCurrency(profit)}
                            </td>
                            <td className="p-4">
                               <div className="flex items-center">
                                 <span className={`text-sm font-bold ${margin < 100 ? 'text-red-500' : 'text-green-500'}`}>
                                    {margin.toFixed(0)}%
                                 </span>
                                 {margin > 150 && <TrendingUp size={16} className="text-green-500 ml-2" />}
                               </div>
                            </td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </div>
      )}
    </div>
  );
};

export default Pricing;
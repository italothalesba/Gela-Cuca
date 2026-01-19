import React, { useState } from 'react';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { INITIAL_LEGACY_DATA } from '../legacyData';
import { Database, CheckCircle, AlertCircle, Loader2, Play, Terminal } from 'lucide-react';

const Settings: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'confirming' | 'importing' | 'success' | 'error'>('idle');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);
  };

  const runImport = async () => {
    setStatus('importing');
    setLogs([]);
    addLog("Iniciando processo de importação...");

    try {
      const batch = writeBatch(db);
      let count = 0;
      let errors = 0;

      addLog(`Processando ${INITIAL_LEGACY_DATA.length} registros...`);

      INITIAL_LEGACY_DATA.forEach((item) => {
        // Sanitização de dados
        // Firestore não aceita undefined ou NaN
        const cleanItem = { ...item };
        
        if (!cleanItem.createdAt || Number.isNaN(cleanItem.createdAt)) {
            cleanItem.createdAt = Date.now();
            addLog(`Aviso: Data corrigida para o item de ${cleanItem.date}`);
        }
        
        // Garantir que flavors é um objeto
        if (cleanItem.type === 'Pedido' && !cleanItem.flavors) {
            cleanItem.flavors = {};
        }

        try {
          const collectionName = cleanItem.type === 'Pedido' ? 'orders' : 'expenses';
          const ref = doc(collection(db, collectionName));
          batch.set(ref, cleanItem);
          count++;
        } catch (err) {
          console.error(err);
          errors++;
          addLog(`Erro ao preparar item: ${JSON.stringify(cleanItem)}`);
        }
      });

      if (count > 0) {
        addLog(`Enviando lote de ${count} operações para o Firebase...`);
        await batch.commit();
        addLog("Lote enviado com sucesso!");
      }

      if (errors > 0) {
        addLog(`Atenção: ${errors} itens não puderam ser processados.`);
        setStatus('error');
      } else {
        addLog("Importação finalizada 100% com sucesso.");
        setStatus('success');
      }

    } catch (error: any) {
      console.error("Erro fatal:", error);
      addLog(`Erro Crítico: ${error.message}`);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Configurações</h2>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
          <Database className="mr-2" size={20} /> Importação de Dados
        </h3>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 mb-6">
          <p className="text-sm text-purple-800">
            Esta ferramenta importa o histórico de <b>{INITIAL_LEGACY_DATA.length} registros</b> (Pedidos e Despesas) extraídos das planilhas antigas.
          </p>
        </div>

        {status === 'idle' && (
          <button
            onClick={() => setStatus('confirming')}
            className="flex items-center justify-center w-full py-3 rounded-lg font-bold text-white bg-rose-500 hover:bg-rose-600 transition-colors"
          >
            <Play className="mr-2" size={20} />
            Iniciar Importação
          </button>
        )}

        {status === 'confirming' && (
          <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300">
            <p className="font-medium text-gray-800">Tem certeza? Isso pode duplicar dados se já foi feito antes.</p>
            <div className="flex space-x-3 justify-center">
              <button
                onClick={() => setStatus('idle')}
                className="px-6 py-2 rounded-lg font-medium text-gray-600 bg-gray-100 hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={runImport}
                className="px-6 py-2 rounded-lg font-bold text-white bg-green-600 hover:bg-green-700"
              >
                Confirmar e Importar
              </button>
            </div>
          </div>
        )}

        {status === 'importing' && (
          <div className="flex flex-col items-center justify-center py-4 space-y-3">
            <Loader2 className="animate-spin text-rose-600" size={32} />
            <p className="text-gray-600 font-medium">Processando dados...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center mb-4">
            <CheckCircle className="mr-2" size={24} />
            <span className="font-bold">Dados importados com sucesso! Verifique o Dashboard.</span>
          </div>
        )}

        {/* Console de Logs Visual */}
        {(status !== 'idle' && status !== 'confirming') && (
          <div className="mt-6 bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-300 h-64 overflow-y-auto shadow-inner">
            <div className="flex items-center text-gray-400 mb-2 border-b border-gray-700 pb-2">
              <Terminal size={14} className="mr-2" />
              <span>Log de Execução</span>
            </div>
            <div className="space-y-1">
              {logs.map((log, index) => (
                <div key={index} className="break-words">
                  <span className="text-rose-400">{'>'}</span> {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
import { Order, Expense, FlavorQuantities } from './types';

// Helper to format Date DD/MM/YYYY to YYYY-MM-DD
const formatDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month}-${day}`;
};

// Helper to create order object
const createOrder = (
  date: string,
  name: string,
  total: number,
  phone: string = '',
  address: string = '',
  flavors: FlavorQuantities = {}
): Order => ({
  date: formatDate(date),
  customerName: name,
  phone,
  address,
  flavors,
  deliveryFee: 0,
  discount: 0,
  total,
  type: 'Pedido',
  createdAt: new Date(formatDate(date)).getTime()
});

// Helper to create expense object
const createExpense = (
  date: string,
  description: string,
  amount: number,
  author: string = 'Sistema'
): Expense => ({
  date: formatDate(date),
  description,
  amount,
  author,
  type: 'Despesa',
  createdAt: new Date(formatDate(date)).getTime()
});

export const INITIAL_LEGACY_DATA: (Order | Expense)[] = [
  // --- AGOSTO 2024 ---
  createOrder('02/08/2024', 'Erica', 65.00, '88994565839', 'Rua Coronel José Xandu, 778'),
  createOrder('02/08/2024', 'Cliente Novo (Instagram)', 33.00, '88992055698', 'Rua José Marinho'),
  createOrder('10/08/2024', 'Cliente Novo (Franklin)', 33.00, '88985531245', 'Rua Franklin Valença'),
  createOrder('10/08/2024', 'Márcio', 55.00, '88999706919', 'Rua Coronel José Moreira Cabral'),
  createOrder('22/08/2024', 'Rosângela Batista Sena', 30.00, '88996524859', 'Betolândia'),
  createOrder('24/08/2024', 'Campeonato Sábado', 429.00, '', 'Evento'),
  createOrder('25/08/2024', 'Campeonato Domingo', 257.00, '', 'Evento'),
  createOrder('27/08/2024', 'Jéssica N', 170.00, '88981705992', 'Rua João Garcia Silva 226'),
  
  // --- SETEMBRO 2024 ---
  createOrder('06/09/2024', 'Ellen', 20.00),
  createOrder('06/09/2024', 'Mabel', 27.00),
  createOrder('06/09/2024', 'Domum', 64.00),
  createOrder('07/09/2024', 'Domum', 222.00),
  createOrder('13/09/2024', 'João Boaventura', 32.00, '88988615911'),
  createOrder('13/09/2024', 'Natalia', 32.00, '88998585046'),
  createOrder('28/09/2024', 'José Quirino', 84.00),
  createOrder('28/09/2024', 'João Paulo', 43.00),
  createOrder('28/09/2024', 'Gabi', 42.00),

  // --- OUTUBRO 2024 ---
  createOrder('02/10/2024', 'Sandra', 86.00, '88988020866'),
  createOrder('07/10/2024', 'Domum', 159.00),
  createOrder('07/10/2024', 'Larice Veloso', 80.00),
  createOrder('10/10/2024', 'Jacilene', 46.00),
  createOrder('11/10/2024', 'Edirla', 93.00),
  createOrder('15/10/2024', 'José Quirino', 83.00),
  createOrder('15/10/2024', 'Fabiana', 59.00),
  createOrder('15/10/2024', 'Domum', 185.00),
  createOrder('16/10/2024', 'Domum', 222.00),
  createOrder('17/10/2024', 'Domum', 215.00),
  createOrder('18/10/2024', 'Domum', 195.00),
  createOrder('21/10/2024', 'Domum', 114.00),
  createOrder('22/10/2024', 'Domum', 150.00),
  createOrder('23/10/2024', 'Domum', 250.00),
  createOrder('24/10/2024', 'Domum', 177.00),
  createOrder('24/10/2024', 'Cantina do Zé Ferreira', 245.00, '', 'Whatsapp'),
  createOrder('25/10/2024', 'Domum', 238.00),
  createOrder('26/10/2024', 'Domum', 336.00),
  createOrder('28/10/2024', 'Domum', 128.00),
  createOrder('30/10/2024', 'Domum', 200.00),
  createOrder('30/10/2024', 'Luizianne', 100.00, '085987281970'),
  createOrder('31/10/2024', 'Domum', 246.00),

  // --- NOVEMBRO 2024 ---
  createOrder('01/11/2024', 'Domum', 160.00),
  createOrder('04/11/2024', 'Domum', 147.00),
  createOrder('05/11/2024', 'Domum', 155.00),
  createOrder('06/11/2024', 'Domum', 235.00),
  createOrder('07/11/2024', 'Domum', 162.00),
  createOrder('08/11/2024', 'Domum', 194.00),
  createOrder('11/11/2024', 'Domum', 46.00),
  createOrder('13/11/2024', 'Domum', 142.00),
  createOrder('14/11/2024', 'Domum', 155.00),
  createOrder('18/11/2024', 'Domum', 163.00),
  createOrder('19/11/2024', 'Domum', 244.00),
  createOrder('19/11/2024', 'Hugo (Encomenda)', 270.00),
  createOrder('21/11/2024', 'Domum', 122.00),
  createOrder('22/11/2024', 'Domum', 208.00),
  createOrder('25/11/2024', 'Fabiana', 70.00),
  createOrder('26/11/2024', 'Domum', 158.00),
  createOrder('27/11/2024', 'Domum', 199.00),
  createOrder('28/11/2024', 'Domum', 258.00),
  createOrder('29/11/2024', 'Domum', 259.00),
  
  // --- DEZEMBRO 2024 ---
  createOrder('01/12/2024', 'Caixa dezembro', 201.57, '', 'Saldo Inicial'),
  createOrder('04/12/2024', 'Domum', 100.00),
  createOrder('04/12/2024', 'Domum', 134.00),
  createOrder('05/12/2024', 'Domum', 128.00),
  createOrder('07/12/2024', 'Campeonato', 245.00),
  createOrder('14/12/2024', 'Domum', 240.00),

  // --- FEVEREIRO 2025 ---
  createOrder('03/02/2025', 'Domum', 205.00),
  createOrder('04/02/2025', 'Domum', 106.00),
  createOrder('05/02/2025', 'Monthana', 97.00),
  createOrder('06/02/2025', 'Domum', 106.00),
  createOrder('07/02/2025', 'Domum', 122.00),
  createOrder('11/02/2025', 'Domum', 225.00),
  createOrder('11/02/2025', 'Domum', 194.00),
  createOrder('12/02/2025', 'Domum', 271.00),
  createOrder('14/02/2025', 'Domum', 120.00),
  createOrder('14/02/2025', 'Domum', 254.00),
  createOrder('17/02/2025', 'Domum', 193.00),
  createOrder('18/02/2025', 'Domum', 198.00),
  createOrder('19/02/2025', 'Domum', 119.00),
  createOrder('20/02/2025', 'Domum', 95.00),
  createOrder('21/02/2025', 'Domum', 164.00),
  createOrder('22/02/2025', 'João Paulo', 68.00),
  createOrder('25/02/2025', 'Domum', 74.00),
  createOrder('26/02/2025', 'Domus', 166.00),
  createOrder('27/02/2025', 'Domus', 175.00),
  createOrder('28/02/2025', 'Domus', 237.00),

  // --- MARÇO 2025 ---
  createOrder('05/03/2025', 'Leilyanne', 30.00),
  createOrder('06/03/2025', 'Ellen', 20.00),
  createOrder('06/03/2025', 'Mabel', 27.00),
  createOrder('06/03/2025', 'Domun', 64.00),
  createOrder('07/03/2025', 'Domum', 222.00),
  createOrder('10/03/2025', 'Domum', 131.00),
  createOrder('11/03/2025', 'Domum', 89.00),
  createOrder('12/03/2025', 'Domum', 85.00),
  createOrder('13/03/2025', 'Domum', 122.00),
  createOrder('14/03/2025', 'Domum', 195.00),
  createOrder('17/03/2025', 'Domum', 173.00),
  createOrder('18/03/2025', 'Domum', 82.00),
  createOrder('20/03/2025', 'Domum', 97.00),
  createOrder('21/03/2025', 'Domum', 174.00),
  createOrder('03/04/2025', 'Domum', 178.00),
  createOrder('04/04/2025', 'Domum', 134.00),
  createOrder('07/04/2025', 'Domum', 134.00),

  // --- DESPESAS ---
  createExpense('23/09/2024', 'Compras reposição (leite)', 196.86, 'Ana'),
  createExpense('23/09/2024', 'Leite', 28.00, 'Ana'),
  createExpense('25/09/2024', 'Saco dindins', 8.50, 'Ana'),
  createExpense('26/09/2024', 'Pagamento Italo', 300.00, 'Monthana'),
  createExpense('08/10/2024', 'Mix Matheus', 225.15, 'Monthana'),
  createExpense('08/10/2024', 'Liquidificador', 53.00, 'Monthana'),
  createExpense('24/10/2024', 'Pagamento de Ítalo', 300.00, 'Monthana'),
  createExpense('28/11/2024', 'Pag Italo', 300.00, 'Monthana'),
  createExpense('29/11/2024', 'Compras gela cuca', 288.27, 'Monthana'),
  createExpense('14/02/2025', 'Reposição supermecado', 135.18, 'Monthana'),
  createExpense('28/02/2025', 'Reposição', 287.00, 'Monthana'),
  createExpense('14/04/2025', 'Reposição Mix Matheus', 115.51, 'Monthana'),
];
import React,{useEffect,useState} from 'react';
import { transactionApi } from '../services';
import { BankAccount, TransactionDto } from '../types';
import { formatCurrency } from '../utils/storage';

interface Props { accounts:BankAccount[]; selectedAccountId:number|null; setSelectedAccountId:(id:number)=>void; }

export const TransactionsView:React.FC<Props>=({accounts,selectedAccountId,setSelectedAccountId})=>{
 const [id,setId]=useState(String(selectedAccountId ?? accounts[0]?.id ?? ''));
 const [type,setType]=useState('ALL'); const [rows,setRows]=useState<TransactionDto[]>([]); const [error,setError]=useState(''); const [loading,setLoading]=useState(false);
 const load=async(accountId:number)=>{if(!accountId)return;setLoading(true);setError('');try{setRows(await transactionApi.getByAccount(accountId));setSelectedAccountId(accountId)}catch(e){setError(e instanceof Error?e.message:'Unable to load transactions')}finally{setLoading(false)}};
 useEffect(()=>{const n=Number(id);if(Number.isInteger(n)&&n>0)load(n)},[]);
 const filtered=type==='ALL'?rows:rows.filter(x=>x.type===type);
 return <div className="space-y-5">
  <div className="bg-[#121214] p-7 rounded-3xl border border-zinc-800">
   <p className="text-purple-400 text-xs font-semibold">GET /api/transactions/account/{'{id}'}</p><h1 className="text-2xl font-bold mt-1">Transaction History</h1>
   <div className="flex flex-col sm:flex-row gap-3 mt-6">
    <select value={id} onChange={e=>setId(e.target.value)} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">{accounts.map(a=><option key={a.id} value={a.id}>#{a.id} — {a.accountHolderName}</option>)}</select>
    <select value={type} onChange={e=>setType(e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3"><option value="ALL">All Types</option><option value="DEPOSIT">Deposit</option><option value="WITHDRAWAL">Withdrawal</option><option value="TRANSFER">Transfer</option></select>
    <button onClick={()=>load(Number(id))} className="px-5 rounded-xl bg-emerald-500 text-zinc-950 font-bold">{loading?'...':'Load'}</button>
   </div>
   {error&&<p className="text-rose-400 text-sm mt-4">{error}</p>}
  </div>
  <div className="bg-[#121214] rounded-2xl border border-zinc-800 overflow-hidden">
   {filtered.length===0?<p className="p-6 text-zinc-400 text-sm">No transactions found.</p>:<div className="divide-y divide-zinc-800">{filtered.map(t=><div key={t.id} className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"><div><p className="font-semibold">{t.type}</p><p className="text-xs text-zinc-500">{new Date(t.transactionDate).toLocaleString('en-IN')}</p></div><div className="text-right"><p className="font-mono">{formatCurrency(Number(t.amount))}</p>{t.receiverAccountId&&<p className="text-xs text-zinc-500">Related account: #{t.receiverAccountId}</p>}</div></div>)}</div>}
  </div>
 </div>;
};

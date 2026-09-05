import React,{useState} from 'react';
import { transactionApi } from '../services';
import { ActiveTab, BankAccount } from '../types';
import { formatCurrency } from '../utils/storage';

interface Props { accounts:BankAccount[]; selectedAccountId:number|null; setSelectedAccountId:(id:number)=>void; onDone:()=>void; }

export const TransferView:React.FC<Props>=({accounts,selectedAccountId,setSelectedAccountId,onDone})=>{
 const [from,setFrom]=useState(String(selectedAccountId ?? accounts[0]?.id ?? ''));
 const [to,setTo]=useState(''); const [amount,setAmount]=useState(''); const [error,setError]=useState(''); const [success,setSuccess]=useState(''); const [loading,setLoading]=useState(false);
 const submit=async(e:React.FormEvent)=>{
  e.preventDefault(); setError(''); setSuccess('');
  const sender=Number(from), receiver=Number(to), value=Number(amount);
  if(!Number.isInteger(sender)||sender<=0||!Number.isInteger(receiver)||receiver<=0||sender===receiver||!Number.isFinite(value)||value<=0){setError('Enter two different valid account IDs and a positive amount.');return;}
  setLoading(true);
  try{await transactionApi.transfer({senderAccountId:sender,receiverAccountId:receiver,amount:value});setSelectedAccountId(sender);setAmount('');setSuccess(`₹${value.toFixed(2)} transferred successfully.`);onDone();}
  catch(err){setError(err instanceof Error?err.message:'Transfer failed');}
  finally{setLoading(false);}
 };
 const balance=accounts.find(a=>a.id===Number(from))?.balance;
 return <div className="max-w-xl mx-auto bg-[#121214] p-7 rounded-3xl border border-zinc-800">
  <p className="text-blue-400 text-xs font-semibold">POST /api/transactions/transfer</p><h1 className="text-2xl font-bold mt-1">Transfer Money</h1>
  <form onSubmit={submit} className="space-y-5 mt-6">
   <div><label className="text-sm text-zinc-300">From Account</label><select value={from} onChange={e=>setFrom(e.target.value)} className="mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">{accounts.map(a=><option key={a.id} value={a.id}>#{a.id} — {a.accountHolderName}</option>)}</select></div>
   <div><label className="text-sm text-zinc-300">To Account ID</label><input value={to} onChange={e=>setTo(e.target.value)} placeholder="Receiver account ID" className="mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3"/></div>
   <div><label className="text-sm text-zinc-300">Amount</label><input type="number" min="0.01" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0.00" className="mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3"/></div>
   {balance!==undefined&&<p className="text-xs text-zinc-500">Available balance: {formatCurrency(balance)}</p>}
   {error&&<p className="text-sm text-rose-400">{error}</p>}{success&&<p className="text-sm text-emerald-400">{success}</p>}
   <button disabled={loading||accounts.length<2} className="w-full py-3 rounded-xl bg-emerald-500 text-zinc-950 font-bold disabled:opacity-50">{loading?'Transferring...':'Transfer Money'}</button>
  </form>
 </div>;
};

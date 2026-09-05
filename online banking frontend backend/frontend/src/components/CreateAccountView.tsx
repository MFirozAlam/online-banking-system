import React, { useState } from 'react';
import { accountApi } from '../services';
import { BankAccount, ActiveTab } from '../types';

interface Props { onAccountCreated:(a:BankAccount)=>void; setActiveTab:(t:ActiveTab)=>void; setSelectedAccountId:(id:number)=>void; }

export const CreateAccountView:React.FC<Props> = ({onAccountCreated,setActiveTab,setSelectedAccountId}) => {
  const [name,setName]=useState('');
  const [type,setType]=useState('SAVINGS');
  const [balance,setBalance]=useState('0');
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);

  const submit=async(e:React.FormEvent)=>{
    e.preventDefault();
    const amount=Number(balance);
    if(!name.trim()||!Number.isFinite(amount)||amount<0){setError('Enter a valid name and non-negative initial balance.');return;}
    setLoading(true);setError('');
    try{
      const a=await accountApi.create(name.trim(),type,amount);
      onAccountCreated(a);setSelectedAccountId(a.id);setActiveTab('getAccount');
    }catch(err){setError(err instanceof Error?err.message:'Unable to create account');}
    finally{setLoading(false);}
  };

  return <div className="max-w-xl mx-auto bg-[#121214] p-7 rounded-3xl border border-zinc-800">
    <p className="text-emerald-400 text-xs font-semibold">POST /api/accounts</p>
    <h1 className="text-2xl font-bold mt-1">Create Bank Account</h1>
    <form onSubmit={submit} className="space-y-5 mt-6">
      <div><label className="text-sm text-zinc-300">Account Holder Name</label><input value={name} onChange={e=>setName(e.target.value)} className="mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3" placeholder="Firoz Alam"/></div>
      <div><label className="text-sm text-zinc-300">Account Type</label><select value={type} onChange={e=>setType(e.target.value)} className="mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3"><option value="SAVINGS">Savings</option><option value="CURRENT">Current</option></select></div>
      <div><label className="text-sm text-zinc-300">Initial Balance</label><input type="number" min="0" step="0.01" value={balance} onChange={e=>setBalance(e.target.value)} className="mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3"/></div>
      {error&&<p className="text-sm text-rose-400">{error}</p>}
      <button disabled={loading} className="w-full py-3 rounded-xl bg-emerald-500 text-zinc-950 font-bold disabled:opacity-50">{loading?'Creating...':'Create Account'}</button>
    </form>
  </div>;
};

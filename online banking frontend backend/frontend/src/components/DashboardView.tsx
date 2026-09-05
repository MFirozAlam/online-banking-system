import React from 'react';
import { ArrowDownRight, ArrowUpRight, CreditCard, UserPlus, Search, Trash2 } from 'lucide-react';
import { BankAccount, ActiveTab } from '../types';
import { formatCurrency } from '../utils/storage';

interface Props { accounts: BankAccount[]; setActiveTab: (tab: ActiveTab) => void; setSelectedAccountId: (id: number) => void; }
export const DashboardView: React.FC<Props> = ({ accounts, setActiveTab, setSelectedAccountId }) => {
  const total = accounts.reduce((s, a) => s + a.balance, 0);
  const select = (id: number, tab: ActiveTab) => { setSelectedAccountId(id); setActiveTab(tab); };
  return <div className="space-y-7 animate-fadeIn">
    <div className="bg-[#121214] p-7 rounded-3xl border border-zinc-800 shadow-xl">
      <p className="text-emerald-400 text-xs font-semibold">LIVE BACKEND DATA</p>
      <h1 className="text-3xl font-bold mt-1">Online Banking Operations</h1>
      <p className="text-zinc-400 text-sm mt-2">React frontend connected directly to the Spring Boot account API.</p>
      <div className="flex flex-wrap gap-3 mt-5">
        <button onClick={() => setActiveTab('create')} className="px-4 py-2.5 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-sm"><UserPlus className="inline w-4 h-4 mr-2"/>Create</button>
        <button onClick={() => setActiveTab('getAccount')} className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-100 text-sm"><Search className="inline w-4 h-4 mr-2"/>Get</button>
        <button onClick={() => setActiveTab('deposit')} className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-100 text-sm"><ArrowDownRight className="inline w-4 h-4 mr-2"/>Deposit</button>
        <button onClick={() => setActiveTab('withdraw')} className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-100 text-sm"><ArrowUpRight className="inline w-4 h-4 mr-2"/>Withdraw</button>
        <button onClick={() => setActiveTab('delete')} className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-100 text-sm"><Trash2 className="inline w-4 h-4 mr-2"/>Delete</button>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-[#121214] p-6 rounded-2xl border border-zinc-800"><p className="text-xs text-zinc-400">Total Accounts</p><p className="text-3xl font-bold mt-2">{accounts.length}</p></div>
      <div className="bg-[#121214] p-6 rounded-2xl border border-zinc-800"><p className="text-xs text-zinc-400">Total Balance</p><p className="text-3xl font-bold mt-2">{formatCurrency(total)}</p></div>
    </div>
    <div className="bg-[#121214] rounded-2xl border border-zinc-800 overflow-hidden">
      <div className="p-5 border-b border-zinc-800"><h2 className="font-bold">Accounts</h2></div>
      {accounts.length === 0 ? <p className="p-6 text-zinc-400 text-sm">No accounts yet. Create one to begin.</p> : accounts.map(a => <div key={a.id} className="p-5 border-b border-zinc-800 last:border-0 flex items-center justify-between gap-4"><div><p className="font-semibold">{a.accountHolderName}</p><p className="text-xs text-zinc-500">Account ID: {a.id}</p></div><div className="text-right"><p className="font-mono">{formatCurrency(a.balance)}</p><button onClick={() => select(a.id, 'getAccount')} className="text-xs text-emerald-400">View account</button></div></div>)}
    </div>
  </div>;
};

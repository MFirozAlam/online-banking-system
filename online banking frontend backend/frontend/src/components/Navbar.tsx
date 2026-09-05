import React from 'react';
import { Building2, LayoutDashboard, UserPlus, Search, ArrowDownRight, ArrowUpRight, ArrowLeftRight, History, Trash2, LogOut } from 'lucide-react';
import { ActiveTab, BankAccount } from '../types';
import { formatCurrency } from '../utils/storage';

interface Props { activeTab:ActiveTab; setActiveTab:(t:ActiveTab)=>void; accounts:BankAccount[]; onLogout:()=>void; }

export const Navbar:React.FC<Props>=({activeTab,setActiveTab,accounts,onLogout})=>{
 const items:[ActiveTab,string,React.ElementType][]=[
  ['dashboard','Dashboard',LayoutDashboard],['create','Create',UserPlus],['getAccount','Accounts',Search],
  ['deposit','Deposit',ArrowDownRight],['withdraw','Withdraw',ArrowUpRight],['transfer','Transfer',ArrowLeftRight],
  ['transactions','History',History],['delete','Delete',Trash2]
 ];
 return <header className="sticky top-0 z-40 bg-[#0e0e10]/95 backdrop-blur-md border-b border-zinc-800">
  <div className="max-w-7xl mx-auto px-4">
   <div className="h-16 flex items-center justify-between">
    <button onClick={()=>setActiveTab('dashboard')} className="flex items-center gap-3">
     <div className="w-10 h-10 rounded-xl bg-emerald-500 text-zinc-950 flex items-center justify-center"><Building2/></div>
     <div className="text-left"><div className="font-bold">Apex Vault</div><div className="text-xs text-zinc-500">Online Banking</div></div>
    </button>
    <div className="flex items-center gap-5">
     <div className="hidden sm:block text-right"><div className="text-xs text-zinc-500">Total Balance</div><div className="text-sm text-emerald-400 font-mono">{formatCurrency(accounts.reduce((s,a)=>s+a.balance,0))}</div></div>
     <button onClick={onLogout} className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800" title="Logout"><LogOut className="w-5 h-5"/></button>
    </div>
   </div>
   <div className="flex overflow-x-auto gap-1 py-2 border-t border-zinc-800">
    {items.map(([id,label,Icon])=><button key={id} onClick={()=>setActiveTab(id)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs whitespace-nowrap ${activeTab===id?'bg-emerald-500 text-zinc-950 font-bold':'text-zinc-400 hover:bg-zinc-900'}`}><Icon className="w-4 h-4"/>{label}</button>)}
   </div>
  </div>
 </header>;
};

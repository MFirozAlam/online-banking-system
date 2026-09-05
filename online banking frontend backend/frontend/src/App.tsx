import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { CreateAccountView } from './components/CreateAccountView';
import { GetAccountView } from './components/GetAccountView';
import { DepositView } from './components/DepositView';
import { WithdrawView } from './components/WithdrawView';
import { DeleteAccountView } from './components/DeleteAccountView';
import { TransferView } from './components/TransferView';
import { TransactionsView } from './components/TransactionsView';
import { LoginView } from './components/LoginView';
import { RegisterView } from './components/RegisterView';
import { accountApi } from './services';
import { BankAccount, ActiveTab, UserDto } from './types';
import { getUser, removeUser } from './utils/storage';

export default function App() {
  const [user, setUser] = useState<UserDto | null>(getUser());
  const [showRegister, setShowRegister] = useState(false);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const refresh = async () => {
    try {
      setAccounts(await accountApi.getAll());
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Cannot connect to backend');
    }
  };

  useEffect(() => {
    if (user) refresh();
  }, [user]);

  const logout = () => {
    removeUser();
    setUser(null);
    setAccounts([]);
    setActiveTab('dashboard');
  };

  if (!user) {
    return showRegister
      ? <RegisterView onRegistered={() => setShowRegister(false)} onShowLogin={() => setShowRegister(false)} />
      : <LoginView onLoginSuccess={setUser} onShowRegister={() => setShowRegister(true)} />;
  }

  const upsert = (account: BankAccount) => {
    setAccounts(prev => prev.some(x => x.id === account.id)
      ? prev.map(x => x.id === account.id ? account : x)
      : [account, ...prev]);
  };

  const deleted = (id: number) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} accounts={accounts} onLogout={logout} />
      {error && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="bg-rose-950/40 border border-rose-800 text-rose-300 rounded-xl px-4 py-3 text-sm">
            {error}<br /><span className="text-xs">Make sure Spring Boot is running on port 8080 and MySQL is running.</span>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'dashboard' && <DashboardView accounts={accounts} setActiveTab={setActiveTab} setSelectedAccountId={setSelectedAccountId} />}
        {activeTab === 'create' && <CreateAccountView onAccountCreated={upsert} setActiveTab={setActiveTab} setSelectedAccountId={setSelectedAccountId} />}
        {activeTab === 'getAccount' && <GetAccountView accounts={accounts} selectedAccountId={selectedAccountId} setSelectedAccountId={setSelectedAccountId} setActiveTab={setActiveTab} />}
        {activeTab === 'deposit' && <DepositView accounts={accounts} selectedAccountId={selectedAccountId} setSelectedAccountId={setSelectedAccountId} onDepositSuccess={upsert} setActiveTab={setActiveTab} />}
        {activeTab === 'withdraw' && <WithdrawView accounts={accounts} selectedAccountId={selectedAccountId} setSelectedAccountId={setSelectedAccountId} onWithdrawSuccess={upsert} setActiveTab={setActiveTab} />}
        {activeTab === 'transfer' && <TransferView accounts={accounts} selectedAccountId={selectedAccountId} setSelectedAccountId={setSelectedAccountId} onDone={refresh} />}
        {activeTab === 'transactions' && <TransactionsView accounts={accounts} selectedAccountId={selectedAccountId} setSelectedAccountId={setSelectedAccountId} />}
        {activeTab === 'delete' && <DeleteAccountView accounts={accounts} selectedAccountId={selectedAccountId} setSelectedAccountId={setSelectedAccountId} onAccountDeleted={deleted} setActiveTab={setActiveTab} />}
      </main>
    </div>
  );
}

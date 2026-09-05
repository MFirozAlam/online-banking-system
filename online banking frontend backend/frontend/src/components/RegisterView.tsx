import { useState } from 'react';
import { authApi } from '../services';
import { RegisterRequest } from '../types';

interface Props { onRegistered: () => void; onShowLogin: () => void; }

export function RegisterView({ onRegistered, onShowLogin }: Props) {
  const [form, setForm] = useState<RegisterRequest>({ username:'', password:'', name:'', email:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const change = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.username.trim() || !form.email.trim() || !form.password) {
      setError('All fields are required'); return;
    }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    try {
      setLoading(true);
      await authApi.register(form);
      onRegistered();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-7">
        <h1 className="text-3xl font-bold">Create User</h1>
        <p className="text-zinc-400 mt-2">Register for online banking</p>
        {error && <div className="mt-5 bg-rose-950/40 border border-rose-800 text-rose-300 rounded-xl px-4 py-3 text-sm">{error}</div>}
        <form onSubmit={submit} className="space-y-4 mt-6">
          {[
            ['name','Full Name','text'], ['username','Username','text'],
            ['email','Email','email'], ['password','Password','password']
          ].map(([name,label,type]) => (
            <div key={name}>
              <label className="block text-sm text-zinc-300 mb-2">{label}</label>
              <input name={name} type={type} value={(form as any)[name]} onChange={change}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-zinc-400" />
            </div>
          ))}
          <button disabled={loading} className="w-full bg-white text-black font-semibold rounded-xl py-3 disabled:opacity-50">
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>
        <p className="text-center text-sm text-zinc-400 mt-6">
          Already registered? <button onClick={onShowLogin} className="text-white font-semibold hover:underline">Login</button>
        </p>
      </div>
    </div>
  );
}

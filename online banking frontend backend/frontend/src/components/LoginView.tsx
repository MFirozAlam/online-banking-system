import { useState } from 'react';
import { authApi } from '../services';
import { LoginRequest, UserDto } from '../types';
import { saveUser } from '../utils/storage';

interface LoginViewProps {
  onLoginSuccess: (user: UserDto) => void;
  onShowRegister: () => void;
}

export function LoginView({
  onLoginSuccess,
  onShowRegister,
}: LoginViewProps) {

  const [form, setForm] = useState<LoginRequest>({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError('');

    if (!form.username.trim()) {
      setError('Username is required');
      return;
    }

    if (!form.password) {
      setError('Password is required');
      return;
    }

    try {
      setLoading(true);

      const user = await authApi.login(form);

      // Save logged-in user
      saveUser(user);

      // Tell App.tsx that login was successful
      onLoginSuccess(user);

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Login failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* Logo / Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            Online Banking
          </h1>

          <p className="text-zinc-400 mt-2">
            Login to your account
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">

          <h2 className="text-xl font-semibold mb-6">
            Welcome Back
          </h2>

          {/* Error */}
          {error && (
            <div className="bg-rose-950/40 border border-rose-800 text-rose-300 rounded-xl px-4 py-3 mb-5 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-zinc-300 mb-2"
              >
                Username
              </label>

              <input
                id="username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-zinc-400"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-300 mb-2"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-zinc-400"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-semibold rounded-xl px-4 py-3 hover:bg-zinc-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

          </form>

          {/* Register */}
          <div className="text-center mt-6 text-sm text-zinc-400">
            Don't have an account?{' '}

            <button
              type="button"
              onClick={onShowRegister}
              className="text-white font-semibold hover:underline"
            >
              Create Account
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Zap, Lock, User } from 'lucide-react';

interface LoginViewProps {
  onLogin: (username: string) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'bakerwaleed' && password === '123') {
      onLogin(username);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f23] text-white p-4">
      <div className="w-full max-w-md p-8 bg-[#1a1a2e] rounded-2xl border border-gray-800 shadow-2xl relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-900/50">
                  <Zap className="text-white fill-current" size={32} />
              </div>
          </div>
          
          <h2 className="text-3xl font-bold text-center mb-2 tracking-tight">Welcome Back</h2>
          <p className="text-gray-400 text-center mb-8 text-sm">Sign in to your TaskFlow account</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-violet-400 transition-colors" size={18} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#0f0f23] border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                  placeholder="bakerwaleed"
                  autoFocus
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-violet-400 transition-colors" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0f0f23] border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                  placeholder="••••••"
                />
              </div>
            </div>
            
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium animate-in slide-in-from-top-2">
                {error}
              </div>
            )}
            
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-violet-900/30 active:scale-[0.98] mt-2"
            >
              Sign In
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-500">
            Use <span className="text-gray-300 font-mono">bakerwaleed</span> / <span className="text-gray-300 font-mono">123</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
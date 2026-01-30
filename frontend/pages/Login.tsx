import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Users } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
    if (email.includes('admin') || email.includes('super')) {
      navigate('/admin');
    } else {
      navigate('/student');
    }
  };

  const fillDemo = (role: 'student' | 'admin' | 'super') => {
    if (role === 'student') setEmail('student@test.com');
    if (role === 'admin') setEmail('admin@test.com');
    if (role === 'super') setEmail('super@test.com');
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-slate-800 p-8 text-center border-b-4 border-blue-600">
          <div className="mx-auto bg-slate-700 w-16 h-16 rounded-full flex items-center justify-center mb-4 ring-2 ring-blue-500">
            <ShieldCheck className="h-8 w-8 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">CampusAssist</h1>
          <p className="text-slate-400 text-sm font-mono uppercase tracking-widest">Incident Management System</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Official Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all bg-slate-50"
                placeholder="id@campus.edu"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Secure Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all bg-slate-50"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg"
            >
              AUTHENTICATE
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest mb-4">Select Role Profile</p>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => fillDemo('student')} className="py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded flex flex-col items-center justify-center transition-colors">
                <User size={16} className="text-slate-600 mb-1" />
                <span className="text-[10px] font-bold text-slate-600">Student</span>
              </button>
              <button onClick={() => fillDemo('admin')} className="py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded flex flex-col items-center justify-center transition-colors">
                <ShieldCheck size={16} className="text-blue-600 mb-1" />
                <span className="text-[10px] font-bold text-blue-600">Officer</span>
              </button>
              <button onClick={() => fillDemo('super')} className="py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded flex flex-col items-center justify-center transition-colors">
                <Users size={16} className="text-purple-600 mb-1" />
                <span className="text-[10px] font-bold text-purple-600">Supervisor</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

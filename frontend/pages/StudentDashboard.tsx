import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import HelpRequestForm from '../components/HelpRequestForm';
import { Calendar, Clock, MapPin, Send } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { user, travelIntents, addTravelIntent } = useApp();
  const navigate = useNavigate();

  // Travel Form State
  const [type, setType] = useState<'Leaving' | 'Returning'>('Leaving');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleTravelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTravelIntent({
      id: Math.random().toString(36).substr(2, 9),
      studentName: user?.name || 'Student',
      type,
      destination,
      date,
      time,
      timestamp: Date.now(),
    });
    // Reset
    setDestination('');
    setDate('');
    setTime('');
  };

  // Format date helper
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Student Dashboard</h1>
          <p className="text-slate-500">Welcome back, manage your campus activities.</p>
        </div>
        <button 
          onClick={() => navigate('/raise-help')}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md text-sm font-bold shadow-md transition-colors"
        >
          DECLARE EMERGENCY
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* CARD 1: Post Travel Intent */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-white">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                <Send className="w-5 h-5 mr-2 text-blue-500" />
                Post Travel Intent
              </h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleTravelSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Type</label>
                    <select 
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                      className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border bg-slate-50 text-sm"
                    >
                      <option value="Leaving">Leaving Campus</option>
                      <option value="Returning">Returning to Campus</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Destination</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        required
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full pl-9 rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border bg-slate-50 text-sm"
                        placeholder="e.g. City Center"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full pl-9 rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border bg-slate-50 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Time</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="time"
                        required
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full pl-9 rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border bg-slate-50 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm text-sm font-medium transition-colors"
                >
                  Post Travel Intent
                </button>
              </form>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Recent Travel Posts</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {travelIntents.slice(0, 5).map((intent) => (
                <div key={intent.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      <span className="text-blue-600">{intent.studentName}</span> 
                      <span className="text-slate-400 mx-1">•</span> 
                      {intent.type === 'Leaving' ? 'To' : 'From'}: {intent.destination}
                    </p>
                  </div>
                  <div className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded">
                    {formatDate(intent.date)} {intent.time}
                  </div>
                </div>
              ))}
              {travelIntents.length === 0 && (
                <div className="p-6 text-center text-sm text-slate-400">No recent travel plans</div>
              )}
            </div>
          </div>
        </div>

        {/* CARD 2: Raise Help Request */}
        <div className="h-full">
          <HelpRequestForm />
        </div>

      </div>
    </Layout>
  );
};

export default StudentDashboard;

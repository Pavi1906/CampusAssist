import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Category, Priority } from '../types';
import { AlertTriangle, ShieldAlert, Lock, Info, MapPin } from 'lucide-react';

interface HelpRequestFormProps {
  isFullPage?: boolean;
}

const HelpRequestForm: React.FC<HelpRequestFormProps> = ({ isFullPage = false }) => {
  const { createRequest, user } = useApp();
  const [category, setCategory] = useState<Category>(Category.Medical);
  const [priority, setPriority] = useState<Priority>(Priority.Normal);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  
  const isEmergency = priority === Priority.Emergency;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) {
      alert("Location is required for incident response.");
      return;
    }
    if (isEmergency) {
      setShowConfirm(true); // Mandatory Governance Step
    } else {
      processSubmission();
    }
  };

  const processSubmission = () => {
    createRequest({
      category,
      priority,
      location,
      description,
    });
    // Reset form
    setDescription('');
    setLocation('');
    setPriority(Priority.Normal);
    setShowConfirm(false);
    if (!isEmergency) {
        alert("Request Registered. Reference ID generated.");
    }
  };

  return (
    <>
      <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${isFullPage ? 'max-w-2xl mx-auto' : 'h-full'}`}>
        <div className={`px-6 py-4 border-b border-slate-100 ${isEmergency ? 'bg-red-600' : 'bg-slate-50'}`}>
          <h3 className={`text-lg font-bold flex items-center ${isEmergency ? 'text-white' : 'text-slate-800'}`}>
            {isEmergency ? <ShieldAlert className="mr-2 h-6 w-6" /> : <Info className="mr-2 h-5 w-5" />}
            {isEmergency ? 'EMERGENCY DECLARATION' : 'Standard Assistance'}
          </h3>
          <p className={`text-xs mt-1 ${isEmergency ? 'text-red-100' : 'text-slate-500'}`}>
            {isEmergency ? 'This action will trigger an immediate campus-wide response.' : 'Routine help request ticket.'}
          </p>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nature of Incident</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border bg-slate-50"
              >
                {Object.values(Category).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Urgency Level</label>
              <div className="grid grid-cols-3 gap-2">
                {[Priority.Normal, Priority.High, Priority.Emergency].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-3 px-2 rounded-lg text-sm font-semibold border-2 transition-all ${
                      priority === p
                        ? p === Priority.Emergency 
                          ? 'border-red-600 bg-red-50 text-red-700' 
                          : p === Priority.High 
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-transparent bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                 Exact Location (Mandatory)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <MapPin className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  required
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border bg-slate-50 text-sm"
                  placeholder="e.g., Block A, Room 204 or 'Library Main Entrance'"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Incident Details (Audited)
              </label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={isFullPage ? 6 : 4}
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border bg-slate-50 resize-none font-mono text-sm"
                placeholder="Describe the situation clearly..."
              />
            </div>

            <div className="pt-2">
               <button
                type="submit"
                className={`w-full py-4 px-4 rounded-md shadow-lg text-sm font-bold text-white transition-all transform hover:scale-[1.01] ${
                  isEmergency
                    ? 'bg-red-600 hover:bg-red-700 ring-4 ring-red-100'
                    : 'bg-slate-800 hover:bg-slate-900'
                }`}
              >
                {isEmergency ? 'DECLARE EMERGENCY' : 'Submit Request'}
              </button>
              {isEmergency && (
                <p className="text-center text-xs text-red-500 mt-2 font-semibold">
                  IP Address and User ID will be logged upon submission.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Emergency Confirmation Modal (The "Break Glass" Step) */}
      {showConfirm && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full border-t-8 border-red-600 animate-pulse-subtle">
            <div className="p-6">
              <div className="flex items-start mb-4">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Confirm Emergency</h3>
                  <p className="text-sm text-slate-600 mt-2">
                    You are about to trigger a <span className="font-bold text-red-600">Priority 1 Alert</span>. 
                    Campus Response Officers will be dispatched to your location immediately.
                  </p>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-md border border-slate-200 mb-6">
                <p className="text-xs text-slate-500 font-mono">
                  ACTION: DECLARE_EMERGENCY<br/>
                  LOCATION: {location}<br/>
                  USER: {user?.email}<br/>
                  TIMESTAMP: {new Date().toISOString()}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-semibold rounded-md hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={processSubmission}
                  className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 shadow-lg flex justify-center items-center"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  CONFIRM ALERT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpRequestForm;

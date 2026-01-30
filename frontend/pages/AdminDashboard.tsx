import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Layout from '../components/Layout';
import { Priority, RequestStatus, Category, UserRole } from '../types';
import { SLA_CONFIG } from '../constants';
import { AlertOctagon, Clock, UserCheck, Shield, AlertTriangle, FileText, CheckSquare, XCircle, TrendingUp, Activity } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { requests, user, transitionRequest } = useApp();
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [currentTime, setCurrentTime] = useState(Date.now());

  // REAL-TIME TICKER: Forces component re-render every second for live timers
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 1. FILTERING (OPERATIONAL VIEW)
  const emergencies = requests.filter(r => r.priority === Priority.Emergency && r.status !== RequestStatus.Closed);
  const workQueue = requests.filter(r => r.priority !== Priority.Emergency && r.status !== RequestStatus.Closed);
  
  // 2. OPERATIONAL METRICS CALCULATION
  const activeBreaches = requests.filter(r => r.status !== RequestStatus.Resolved && r.status !== RequestStatus.Closed && r.slaDeadline < currentTime).length;
  
  const calculateAvgResponse = () => {
    const resolved = requests.filter(r => r.status === RequestStatus.Resolved);
    if (resolved.length === 0) return 0;
    const totalTime = resolved.reduce((acc, r) => acc + (r.updatedAt - r.createdAt), 0);
    return Math.round((totalTime / resolved.length) / 60000); // Minutes
  };
  
  const calculateAckRate = () => {
     // Percentage of requests acknowledged within 15 mins (Arbitrary operational target)
     const acknowledged = requests.filter(r => r.status !== RequestStatus.Created);
     if (acknowledged.length === 0) return 100;
     const onTime = acknowledged.filter(r => {
        const ackLog = r.history.find(h => h.action.includes('Acknowledged'));
        if (!ackLog) return true; // Assume older format is ok
        return (ackLog.timestamp - r.createdAt) < 15 * 60 * 1000; 
     });
     return Math.round((onTime.length / acknowledged.length) * 100);
  };

  // 3. SLA FORMATTER
  const getSlaStatus = (deadline: number, isEscalated: boolean) => {
    const timeRemaining = deadline - currentTime;
    const isBreached = timeRemaining < 0;
    const hours = Math.floor(Math.abs(timeRemaining) / 3600000);
    const mins = Math.floor((Math.abs(timeRemaining) % 3600000) / 60000);
    const secs = Math.floor((Math.abs(timeRemaining) % 60000) / 1000);
    
    // VISUAL CLUES
    let style = 'bg-green-100 text-green-800';
    if (isBreached || isEscalated) style = 'bg-red-900 text-white font-bold animate-pulse';
    else if (timeRemaining < 30 * 60 * 1000) style = 'bg-orange-100 text-orange-800 font-bold'; // Warning < 30m

    return {
      text: `${isBreached ? '-' : ''}${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`,
      isBreached,
      style
    };
  };

  // 4. ACTION HANDLERS
  const handleTransition = (newStatus: RequestStatus) => {
    if (!selectedRequestId) return;
    try {
      transitionRequest(selectedRequestId, newStatus, notes);
      setNotes('');
      // Don't close modal if it's just an acknowledgment, only if resolved/closed
      if (newStatus === RequestStatus.Resolved || newStatus === RequestStatus.Closed) {
        setSelectedRequestId(null);
      }
    } catch (e) {
      alert("Error: " + e);
    }
  };

  const selectedRequest = requests.find(r => r.id === selectedRequestId);

  return (
    <Layout>
      <div className="space-y-6">
        
        {/* OPERATIONAL METRICS BAR */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-col justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active SLA Breaches</span>
            <div className="flex items-end justify-between mt-2">
              <span className={`text-3xl font-bold ${activeBreaches > 0 ? 'text-red-600' : 'text-slate-800'}`}>{activeBreaches}</span>
              <Activity className={`w-6 h-6 ${activeBreaches > 0 ? 'text-red-500' : 'text-slate-300'}`} />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-col justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Response Time</span>
            <div className="flex items-end justify-between mt-2">
              <span className="text-3xl font-bold text-slate-800">{calculateAvgResponse()} <span className="text-sm text-slate-500 font-normal">min</span></span>
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
          </div>
           <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-col justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">15m Acknowledge Rate</span>
            <div className="flex items-end justify-between mt-2">
              <span className="text-3xl font-bold text-slate-800">{calculateAckRate()}%</span>
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
          </div>
           <div className="bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-700 flex flex-col justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Status</span>
            <div className="flex items-end justify-between mt-2">
              <span className="text-lg font-bold text-green-400">OPERATIONAL</span>
              <Shield className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        {/* TOP SECTION: EMERGENCY OPERATIONS CENTER (EOC) */}
        <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700 relative">
          {activeBreaches > 0 && (
             <div className="absolute top-0 inset-x-0 h-1 bg-red-600 animate-pulse"></div>
          )}
          <div className="bg-gradient-to-r from-red-800 to-red-900 px-6 py-4 flex justify-between items-center shadow-lg">
             <div className="flex items-center space-x-3">
               <AlertOctagon className="text-white h-8 w-8 animate-pulse" />
               <div>
                 <h2 className="text-white font-bold text-xl tracking-wide">ACTIVE EMERGENCIES</h2>
                 <p className="text-red-200 text-xs font-mono tracking-wider">RESPONSE OFFICER: {user?.name.toUpperCase()}</p>
               </div>
             </div>
             <div className="flex flex-col items-end">
               <div className="bg-black/40 px-4 py-2 rounded border border-red-500/50 text-white font-mono font-bold text-2xl backdrop-blur-sm">
                 {emergencies.length}
               </div>
               {activeBreaches > 0 && <span className="text-xs font-bold text-red-200 mt-1 animate-pulse">⚠️ {activeBreaches} BREACHED</span>}
             </div>
          </div>
          
          <div className="p-0">
             {emergencies.length === 0 ? (
               <div className="p-12 flex flex-col items-center justify-center text-slate-500">
                 <Shield className="h-16 w-16 mb-4 opacity-20" />
                 <p className="font-mono">NO ACTIVE THREATS DETECTED</p>
               </div>
             ) : (
               <table className="w-full text-left text-sm text-slate-300">
                 <thead className="bg-slate-800 text-slate-400 font-mono text-xs uppercase">
                   <tr>
                     <th className="px-6 py-4">SLA Timer</th>
                     <th className="px-6 py-4">Location</th>
                     <th className="px-6 py-4">Details</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4 text-right">Command</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-700">
                   {emergencies.map(req => {
                     const sla = getSlaStatus(req.slaDeadline, req.escalated);
                     return (
                       <tr key={req.id} className={`${req.escalated ? 'bg-red-900/10' : 'hover:bg-slate-800/50'} transition-colors`}>
                         <td className="px-6 py-4 font-mono font-bold">
                           <div className="flex flex-col">
                             <span className={`px-2 py-1 rounded text-center mb-1 ${sla.style}`}>
                               {sla.text}
                             </span>
                             {req.escalated && <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider text-center">Escalated</span>}
                           </div>
                         </td>
                         <td className="px-6 py-4 font-bold text-white flex items-center">
                            <span className="bg-slate-700 p-1 rounded mr-2"><AlertTriangle size={12}/></span>
                            {req.location}
                         </td>
                         <td className="px-6 py-4">
                           <div className="text-white font-medium mb-0.5">{req.category}</div>
                           <div className="text-slate-400 text-xs max-w-xs truncate">{req.description}</div>
                           <div className="text-slate-500 text-[10px] mt-1">{req.studentName}</div>
                         </td>
                         <td className="px-6 py-4">
                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-200 border border-slate-600 uppercase tracking-wide">
                             {req.status}
                           </span>
                         </td>
                         <td className="px-6 py-4 text-right">
                           <button 
                            onClick={() => setSelectedRequestId(req.id)}
                            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider shadow-lg transform hover:scale-105 transition-all"
                           >
                             Manage
                           </button>
                         </td>
                       </tr>
                     );
                   })}
                 </tbody>
               </table>
             )}
          </div>
        </div>

        {/* MIDDLE SECTION: STANDARD WORK QUEUE */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-slate-700 flex items-center">
              <CheckSquare className="w-5 h-5 mr-2 text-slate-400" />
              Standard Assistance Queue
            </h3>
            <span className="text-xs font-mono text-slate-500">
              PENDING: {workQueue.length}
            </span>
          </div>
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3">Priority</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {workQueue.map(req => (
                <tr key={req.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      req.priority === Priority.High ? 'bg-orange-100 text-orange-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {req.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">{req.category}</td>
                  <td className="px-6 py-4 font-medium">{req.location}</td>
                  <td className="px-6 py-4">{req.status}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedRequestId(req.id)}
                      className="text-blue-600 hover:text-blue-800 font-semibold text-xs"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL & ACTION MODAL */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto flex flex-col">
            
            {/* Header */}
            <div className={`p-6 border-b ${selectedRequest.priority === Priority.Emergency ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border ${
                  selectedRequest.priority === Priority.Emergency 
                    ? 'bg-red-600 text-white border-red-700' 
                    : 'bg-blue-600 text-white border-blue-700'
                }`}>
                  {selectedRequest.priority}
                </span>
                <button onClick={() => setSelectedRequestId(null)} className="text-slate-400 hover:text-slate-600">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-1">{selectedRequest.category} Request</h2>
              <div className="flex space-x-4 text-xs font-mono text-slate-500">
                <span>ID: {selectedRequest.id}</span>
                <span className={selectedRequest.escalated ? 'text-red-600 font-bold' : ''}>
                   {selectedRequest.escalated ? '⚠ ESCALATED TO SUPERVISOR' : `SLA Deadline: ${new Date(selectedRequest.slaDeadline).toLocaleTimeString()}`}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 space-y-8">
              
              {/* Location & Description */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                 <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Location</span>
                        <span className="text-sm font-semibold text-slate-800">{selectedRequest.location}</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Student</span>
                        <span className="text-sm font-semibold text-slate-800">{selectedRequest.studentName}</span>
                    </div>
                 </div>
                 <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Description</span>
                    <p className="text-sm text-slate-700 leading-relaxed">{selectedRequest.description}</p>
                 </div>
              </div>

              {/* Action Console */}
              <div className="bg-white border-2 border-slate-100 rounded-xl p-4 shadow-sm">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
                  <UserCheck className="w-4 h-4 mr-1" />
                  Response Console
                </h4>
                
                {/* Workflow Buttons */}
                <div className="flex flex-col gap-3 mb-4">
                  {selectedRequest.status === RequestStatus.Created && (
                    <button 
                      onClick={() => handleTransition(RequestStatus.Acknowledged)}
                      className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 shadow-sm"
                    >
                      ACKNOWLEDGE RECEIPT
                    </button>
                  )}
                  {selectedRequest.status === RequestStatus.Acknowledged && (
                    <button 
                      onClick={() => handleTransition(RequestStatus.InProgress)}
                      className="w-full bg-indigo-600 text-white py-3 rounded font-bold hover:bg-indigo-700 shadow-sm"
                    >
                      START RESPONSE
                    </button>
                  )}
                  {selectedRequest.status === RequestStatus.InProgress && (
                    <div className="w-full">
                       <label className="text-xs font-bold text-slate-500 mb-1 block">Resolution Notes (Mandatory)</label>
                       <textarea 
                        placeholder="Detail actions taken and outcome..."
                        className="w-full border-slate-300 bg-slate-50 p-3 text-sm rounded mb-2 h-24 focus:ring-2 focus:ring-green-500 outline-none border"
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                       />
                       <button 
                        onClick={() => handleTransition(RequestStatus.Resolved)}
                        disabled={!notes.trim()}
                        className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                      >
                        MARK RESOLVED
                      </button>
                    </div>
                  )}
                  
                  {/* Supervisor Only Action */}
                  {selectedRequest.status === RequestStatus.Resolved && (
                    <div className="w-full border-t border-slate-100 pt-4 mt-2">
                      <div className={`p-3 rounded mb-3 text-xs ${selectedRequest.escalated ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-slate-50 text-slate-500'}`}>
                         {selectedRequest.escalated 
                            ? "This incident was escalated due to SLA breach. Formal review required." 
                            : "Verify resolution integrity before closing."}
                      </div>
                      
                      <button 
                        onClick={() => handleTransition(RequestStatus.Closed)}
                        disabled={(selectedRequest.priority === Priority.Emergency || selectedRequest.escalated) && user?.role !== 'supervisor'}
                        className="w-full bg-slate-800 text-white py-3 rounded font-bold hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                      >
                        {(selectedRequest.priority === Priority.Emergency || selectedRequest.escalated) ? 'VERIFY & CLOSE (SUPERVISOR ONLY)' : 'CLOSE TICKET'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Audit Log */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-1" />
                  Audit Trail (Immutable)
                </h4>
                <div className="border-l-2 border-slate-200 ml-2 space-y-6 pl-4 pt-2">
                  {selectedRequest.history.map((entry, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-slate-300 border-2 border-white"></div>
                      <p className="text-xs font-bold text-slate-700 flex justify-between">
                        <span>{entry.action}</span>
                        <span className="text-[10px] text-slate-400 font-mono font-normal">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                      </p>
                      <p className="text-[10px] text-slate-500 mb-1">
                        Actor: {entry.actorName} <span className="text-slate-300">|</span> Role: {entry.actorRole}
                      </p>
                      {entry.notes && (
                        <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded mt-1 border border-slate-100 italic">
                          "{entry.notes}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminDashboard;

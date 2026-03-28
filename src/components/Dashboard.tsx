import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Calendar,
  ChevronRight,
  Trash2,
  MoreVertical,
  ArrowUpRight,
  Calculator,
  History,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { db, auth } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';

interface Session {
  id: string;
  name: string;
  createdAt: any;
  factors: string[];
  results: any[];
}

export const Dashboard = ({ onNewSession, onViewSession, userId }: {
  onNewSession: () => void;
  onViewSession: (id: string) => void;
  userId?: string;
}) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      const uid = userId || auth.currentUser?.uid;
      if (!uid) {
        setLoading(false);
        return;
      }

      if (uid === 'guest-user') {
        // Provide mock data for localhost preview so it's not empty
        setSessions([
          {
            id: 'mock-session-1',
            name: 'Consumer Behavior Analysis (Mock)',
            createdAt: { toDate: () => new Date(Date.now() - 86400000 * 2) },
            factors: ['Price', 'Quality', 'Brand', 'Packaging'],
            results: []
          },
          {
            id: 'mock-session-2',
            name: 'Employee Engagement Survey (Mock)',
            createdAt: { toDate: () => new Date(Date.now() - 86400000 * 5) },
            factors: ['Salary', 'Culture', 'Work-Life Balance', 'Growth'],
            results: []
          }
        ]);
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, 'sessions'),
          where('uid', '==', uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Session[];
        setSessions(data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [userId]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(id);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteDoc(doc(db, 'sessions', deletingId));
      setSessions(sessions.filter(s => s.id !== deletingId));
    } catch (error) {
      console.error("Error deleting session:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredSessions = sessions.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card bg-white/95 rounded-[2rem] p-10 max-w-sm w-full shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] space-y-8 text-center"
            >
              <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 mx-auto shadow-inner">
                <Trash2 size={40} />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Erase Analysis?</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  This action is irreversible. All research data associated with this session will be permanently purged from the archive.
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeletingId(null)}
                  className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-4 rounded-2xl font-bold text-white bg-red-500 hover:bg-red-600 transition-all active:scale-95 shadow-xl shadow-red-100"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-indigo-100">
              System Active
            </span>
            <div className="h-px w-12 bg-indigo-100" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-display font-black tracking-tight text-slate-900"
          >
            Scholar <span className="text-indigo-600">Terminal</span>.
          </motion.h1>
          <p className="text-slate-500 font-medium text-xl max-w-2xl leading-relaxed">
            Welcome, <span className="text-slate-900 font-bold">{auth.currentUser?.displayName?.split(' ')[0] || 'Researcher'}</span>.
            Your academic environment is synchronized and ready for analysis.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewSession}
          className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-4 hover:bg-black shadow-[0_20px_40px_-12px_rgba(0,0,0,0.3)] transition-all group shrink-0"
        >
          <Plus size={22} className="text-indigo-400 group-hover:rotate-90 transition-transform duration-500" />
          GENERATE NEW ANALYSIS
        </motion.button>
      </div>

      {/* Bento Grid Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6 auto-rows-[240px]">
        {/* Total Research - Mini Bento */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2 glass-card p-10 rounded-[2.5rem] border border-white/60 shadow-sm flex flex-col justify-between group hover:border-indigo-300 transition-all duration-700 relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="w-16 h-16 bg-indigo-50/50 rounded-2xl flex items-center justify-center text-indigo-600 mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
              <Calculator size={32} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Research Index</p>
              <p className="text-6xl font-display font-black text-slate-900 tracking-tighter">
                {sessions.length.toString().padStart(2, '0')}
              </p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -translate-x-[-30%] -translate-y-[30%] opacity-50 blur-3xl group-hover:bg-indigo-100 transition-colors" />
        </motion.div>

        {/* Global Access - Dynamic Bento */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="md:col-span-2 bg-slate-900 p-10 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] text-white flex flex-col justify-between group cursor-pointer overflow-hidden relative"
        >
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-2">Compute Engine</p>
                <p className="text-5xl font-display font-black text-white tracking-tight">Active Elite</p>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-indigo-400 backdrop-blur-md">
                <ArrowUpRight size={24} />
              </div>
            </div>
            <p className="text-slate-400 font-medium mt-4 text-sm max-w-[180px]">
              Advanced Garrett Matrix processing enabled for all projects.
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="h-2 flex-1 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "65%" }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="h-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.5)]"
              />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">65% Load</span>
          </div>
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-indigo-500 rounded-full opacity-10 blur-[80px] group-hover:opacity-20 transition-opacity" />
        </motion.div>

        {/* Secondary Stats Cluster */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="md:col-span-1 glass-card p-8 rounded-[2.5rem] border border-white/60 shadow-sm flex flex-col items-center justify-center gap-4 group hover:border-emerald-300 hover:bg-emerald-50/10 transition-all duration-500"
        >
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
            <History size={24} />
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Live Sync</p>
            <p className="text-2xl font-display font-black text-slate-900">Stable</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="md:col-span-3 glass-card p-10 rounded-[2.5rem] border border-white/60 shadow-sm overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-8 group"
        >
          <div className="space-y-4">
            <h3 className="text-2xl font-display font-black text-slate-900">Garrett Ranking Specialized.</h3>
            <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-md">
              ScholarStack uses high-precision matrix calculations to prioritize academic factors.
              Our algorithms ensure mathematical rigor in every result.
            </p>
          </div>
          <div className="flex -space-x-4">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="w-12 h-12 rounded-full bg-slate-100 border-4 border-white flex items-center justify-center shadow-lg">
                <div className={`w-full h-full rounded-full bg-indigo-${idx}00 opacity-20`} />
              </div>
            ))}
            <div className="w-12 h-12 rounded-full bg-slate-900 border-4 border-white flex items-center justify-center shadow-lg text-[10px] text-white font-black">
              AI+
            </div>
          </div>
        </motion.div>
      </div>

      {/* Library Archive Terminal */}
      <div className="glass-card rounded-[3rem] border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden min-h-[500px] flex flex-col">
        <div className="p-10 md:p-12 border-b border-white/40 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white/40">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-slate-900 rounded-[1.25rem] flex items-center justify-center shadow-2xl">
              <History size={28} className="text-indigo-400" />
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">
                {showAll ? 'Academic Archive' : 'Recent Collections'}
              </h2>
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-[0.2em] flex items-center gap-2 group/btn"
              >
                {showAll ? 'Show Recent Only' : 'Explore Extended Library'}
                <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="relative group max-w-sm w-full">
            <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Query library repository..."
              className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[1.25rem] pl-14 pr-7 py-5 text-sm font-medium focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500/30 outline-none w-full transition-all shadow-inner"
            />
          </div>
        </div>

        <div className="flex-1 divide-y divide-slate-50">
          {loading ? (
            <div className="h-[400px] flex flex-col items-center justify-center gap-6">
              <div className="relative">
                <div className="w-12 h-12 border-[3px] border-indigo-100 rounded-full" />
                <div className="absolute top-0 w-12 h-12 border-[3px] border-indigo-600 border-t-transparent rounded-full animate-spin shadow-lg shadow-indigo-100" />
              </div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] animate-pulse">Syncing Database...</p>
            </div>
          ) : (showAll ? filteredSessions : filteredSessions.slice(0, 5)).length > 0 ? (
            <div className="grid grid-cols-1">
              {(showAll ? filteredSessions : filteredSessions.slice(0, 5)).map((session, idx) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
                  onClick={() => onViewSession(session.id)}
                  className="p-8 md:p-10 flex items-center justify-between cursor-pointer group border-l-[6px] border-transparent hover:border-indigo-600 transition-all duration-300"
                >
                  <div className="flex items-center gap-8 min-w-0">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-sm border border-slate-100 group-hover:border-indigo-100 group-hover:text-indigo-600 group-hover:scale-105 transition-all duration-500">
                      <FileText size={28} />
                    </div>
                    <div className="min-w-0 space-y-2">
                      <h3 className="text-xl font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors tracking-tight">
                        {session.name}
                      </h3>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-slate-400" />
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            {session.createdAt?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="h-1 w-1 bg-slate-200 rounded-full" />
                        <div className="px-3 py-1 bg-indigo-50/50 rounded-lg text-[10px] font-black text-indigo-600 uppercase tracking-widest border border-indigo-100/50">
                          {session.factors.length} MATRIX FACTORS
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <button
                      onClick={(e) => handleDelete(session.id, e)}
                      className="p-4 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all md:opacity-0 group-hover:opacity-100 active:scale-90"
                    >
                      <Trash2 size={22} />
                    </button>
                    <div className="w-12 h-12 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-300 group-hover:border-indigo-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-[0_12px_24px_-8px_rgba(79,70,229,0.4)] transition-all duration-500">
                      <ChevronRight size={24} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-32 text-center space-y-8">
              <div className="w-32 h-32 bg-slate-50/80 backdrop-blur-md rounded-[3rem] border border-white flex items-center justify-center mx-auto text-slate-200 shadow-inner group-hover:scale-110 transition-transform duration-700">
                <History size={64} />
              </div>
              <div className="space-y-3">
                <p className="text-2xl font-display font-black text-slate-900 uppercase tracking-tight">Archive Repository Empty</p>
                <p className="text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
                  Your Garret Ranking analytics will be archived here once a session is completed.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNewSession}
                className="text-indigo-600 font-black border-b-[3px] border-indigo-100 hover:border-indigo-600 transition-all pb-1 uppercase tracking-[0.2em] text-[10px]"
              >
                Start Your First Master Research
              </motion.button>
            </div>
          )}
        </div>

        {!loading && filteredSessions.length > 5 && !showAll && (
          <div className="p-10 text-center bg-slate-50/30 border-t border-slate-100">
            <button
              onClick={() => setShowAll(true)}
              className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm"
            >
              Access Complete Repository
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

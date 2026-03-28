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
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-sm w-full border border-slate-200 dark:border-slate-700 shadow-xl space-y-6 text-center"
            >
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mx-auto">
                <Trash2 size={28} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Delete session?</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  This can't be undone. All research data for this session will be permanently removed.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeletingId(null)}
                  className="flex-1 px-5 py-3 rounded-xl font-semibold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-5 py-3 rounded-xl font-semibold text-sm text-white bg-red-500 hover:bg-red-600 transition-all active:scale-95"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100"
          >
            Good morning, <span className="text-indigo-600">{auth.currentUser?.displayName?.split(' ')[0] || 'Researcher'}</span>.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-1 text-slate-500 dark:text-slate-400 text-sm"
          >
            {sessions.length} session{sessions.length !== 1 ? 's' : ''} in your research archive.
          </motion.p>
        </div>
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          whileTap={{ scale: 0.97 }}
          onClick={onNewSession}
          className="bg-slate-900 dark:bg-indigo-600 text-white px-7 py-3 rounded-2xl font-bold text-sm flex items-center gap-2.5 hover:bg-black dark:hover:bg-indigo-700 transition-all shrink-0 shadow-sm"
        >
          <Plus size={18} />
          New Analysis
        </motion.button>
      </div>

      {/* Stat Row */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        className="grid grid-cols-3 gap-4"
      >
        {[
          { label: 'Total Sessions', value: sessions.length.toString().padStart(2, '0'), icon: Calculator, color: 'text-indigo-600 bg-indigo-50' },
          { label: 'Engine Status', value: 'Active', icon: ArrowUpRight, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Live Sync', value: 'Stable', icon: History, color: 'text-slate-600 bg-slate-100' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
              <stat.icon size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{stat.label}</p>
              <p className="font-bold text-slate-900 dark:text-slate-100 text-lg leading-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Sessions List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              {showAll ? 'All Sessions' : 'Recent Sessions'}
            </h2>
            {!showAll && filteredSessions.length > 5 && (
              <button
                onClick={() => setShowAll(true)}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 mt-0.5"
              >
                View all {filteredSessions.length} <ChevronRight size={12} />
              </button>
            )}
          </div>
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search sessions…"
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:text-slate-100 placeholder:text-slate-400 w-56 transition-all"
            />
          </div>
        </div>

        {/* Body */}
        <div className="divide-y divide-slate-50 dark:divide-slate-800">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-slate-400">Loading sessions…</p>
            </div>
          ) : (showAll ? filteredSessions : filteredSessions.slice(0, 5)).length > 0 ? (
            (showAll ? filteredSessions : filteredSessions.slice(0, 5)).map((session, idx) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                onClick={() => onViewSession(session.id)}
                className="px-6 py-4 flex items-center justify-between cursor-pointer group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 shrink-0 group-hover:bg-indigo-100 transition-colors">
                    <FileText size={17} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 transition-colors">
                      {session.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Calendar size={11} className="text-slate-400" />
                      <span className="text-xs text-slate-400">
                        {session.createdAt?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="text-slate-200 dark:text-slate-700">·</span>
                      <span className="text-xs text-slate-400">{session.factors.length} factors</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => handleDelete(session.id, e)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={15} />
                  </button>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center space-y-4">
              <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-slate-300 dark:text-slate-600">
                <History size={28} />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">No sessions yet</p>
                <p className="text-slate-400 text-xs mt-1">Your Garrett Ranking sessions will appear here.</p>
              </div>
              <button
                onClick={onNewSession}
                className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm transition-colors"
              >
                Start first analysis →
              </button>
            </div>
          )}
        </div>

        {!loading && filteredSessions.length > 5 && showAll && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              onClick={() => setShowAll(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              Show less
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

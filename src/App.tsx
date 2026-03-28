import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { GarrettModule } from './components/GarrettModule';
import { auth, signInWithGoogle } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, BarChart3, Shield, Zap, ChevronRight, Github } from 'lucide-react';
import { cn } from './lib/utils';
import { useTheme } from './lib/ThemeContext';

const LandingPage = ({ onSignIn, isSigningIn }: { onSignIn: () => void, isSigningIn: boolean }) => (
  <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">

    {/* Navbar */}
    <nav className="fixed top-0 w-full z-50 px-6 py-5">
      <div className="max-w-6xl mx-auto flex justify-between items-center bg-white/80 backdrop-blur-xl border border-slate-200/80 px-6 py-3 rounded-2xl shadow-sm">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-110">
            <Calculator size={16} />
          </div>
          <span className="font-bold text-lg tracking-tight">Scholar<span className="text-indigo-600">Stack</span></span>
        </motion.div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-500">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#methodology" className="hover:text-slate-900 transition-colors">Methodology</a>
          </div>
          <button
            onClick={onSignIn}
            disabled={isSigningIn}
            className="bg-slate-900 text-white px-5 py-2 rounded-xl font-semibold text-sm hover:bg-black transition-all active:scale-95 shadow-sm disabled:opacity-50"
          >
            {isSigningIn ? 'Connecting…' : 'Sign In'}
          </button>
        </div>
      </div>
    </nav>

    <main>
      {/* Hero */}
      <section className="pt-36 pb-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left copy */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">V2.4 — Precision Engine Active</span>
            </motion.div>

            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="text-5xl md:text-6xl font-black tracking-tight leading-[1.05] text-slate-900"
              >
                Research ranked.<br />
                <span className="text-indigo-600">Precisely.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 }}
                className="text-lg text-slate-500 max-w-md leading-relaxed"
              >
                ScholarStack automates Garrett Ranking methodology — from raw data to publication-ready outputs in seconds.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <button
                onClick={onSignIn}
                disabled={isSigningIn}
                className="w-full sm:w-auto bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-black transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Launch Terminal
                <ChevronRight size={16} className="text-indigo-400" />
              </button>
              <button className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white border border-slate-200 font-bold text-sm text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all">
                Documentation
              </button>
            </motion.div>
          </div>

          {/* Right — preview card */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
            className="hidden lg:block"
          >
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Final Rankings</p>
                  <p className="text-sm font-bold text-slate-900">Consumer Behavior Study</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Complete</span>
              </div>
              <div className="space-y-3">
                {[
                  { rank: 1, label: 'Product Quality', score: '87.4', color: 'bg-indigo-500' },
                  { rank: 2, label: 'Price Sensitivity', score: '74.1', color: 'bg-indigo-400' },
                  { rank: 3, label: 'Brand Perception', score: '61.8', color: 'bg-indigo-300' },
                  { rank: 4, label: 'Distribution', score: '55.2', color: 'bg-slate-200' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <span className="w-6 text-xs font-black text-slate-400 text-right">{item.rank}</span>
                    <div className="flex-1 h-7 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${parseInt(item.score)}%` }}
                        transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className={`h-full ${item.color} opacity-80`}
                      />
                      <span className="absolute inset-0 flex items-center px-3 text-xs font-semibold text-slate-700">{item.label}</span>
                    </div>
                    <span className="w-10 text-xs font-black text-slate-900 text-right">{item.score}</span>
                  </motion.div>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-500">APA Table</span>
                <span className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-500">CSV</span>
                <span className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-500">Excel</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature strip */}
      <section id="features" className="py-20 px-6 border-t border-slate-100">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-3">Capabilities</p>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Built for academic rigour.</h2>
          </motion.div>

          <div id="methodology" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: 'Garrett Synthesis', desc: 'Automate complex statistical ranking using verified academic formulas. Results in seconds.' },
              { icon: BarChart3, title: 'HD Visual Reports', desc: 'Generate publication-quality bar, radar, and pie charts with one click — export-ready.' },
              { icon: Shield, title: 'Secure & Private', desc: 'Firebase-backed cloud storage with per-user data isolation. Sessions are always private.' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group p-7 bg-white border border-slate-200 rounded-2xl hover:border-indigo-200 hover:shadow-sm transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-5 transition-transform duration-300 group-hover:scale-105">
                  <item.icon size={20} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center text-white">
              <Calculator size={14} />
            </div>
            <span className="font-bold text-slate-900">ScholarStack</span>
            <span className="text-slate-300 text-xs">·</span>
            <span className="text-xs text-slate-400">© 2026 Xtract Intelligence</span>
          </div>
          <div className="flex items-center gap-6 text-xs font-semibold text-slate-400">
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Terms</a>
            <a href="https://github.com/XtracT1108/ScholarStack" target="_blank" rel="noreferrer" className="hover:text-slate-600 transition-colors flex items-center gap-1.5">
              <Github size={14} /> GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  </div>
);

const SettingsPanel = () => {
  const { isDark, toggle } = useTheme();
  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings</h2>
      <div className="space-y-4">
        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100">Dark Mode</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isDark ? 'Dark theme is active' : 'Switch to dark theme'}
            </p>
          </div>
          <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isDark ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${isDark ? 'left-7' : 'left-1'
                }`}
            />
          </button>
        </div>
        {/* Export Format */}
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100">Export Format</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Default citation style for exports</p>
          </div>
          <select className="bg-white dark:bg-slate-700 dark:text-slate-100 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1 text-sm font-medium">
            <option>APA 7th Edition</option>
            <option>MLA 9th Edition</option>
            <option>Chicago</option>
          </select>
        </div>
        {/* App Info */}
        <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900">
          <p className="text-sm font-bold text-indigo-700 dark:text-indigo-400">ScholarStack v2.4.0</p>
          <p className="text-xs text-indigo-500 dark:text-indigo-500 mt-1">Academic Research Engine — Alpha</p>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Enable local preview without Firebase Auth domain restrictions
    if (window.location.hostname === 'localhost') {
      setUser({
        uid: 'guest-user',
        email: 'guest@scholarstack.local',
        displayName: 'Guest Researcher',
        photoURL: 'https://ui-avatars.com/api/?name=Guest+Researcher&background=4f46e5&color=fff'
      } as User);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    if (isSigningIn) return;
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className={cn(isSigningIn && "pointer-events-none opacity-80")}>
        <LandingPage onSignIn={handleSignIn} isSigningIn={isSigningIn} />
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <Dashboard
            onNewSession={() => setActiveTab('garrett')}
            onViewSession={(id) => {
              console.log("Viewing session:", id);
              setActiveTab('garrett');
            }}
            userId={user?.uid}
          />
        )}
        {activeTab === 'garrett' && <GarrettModule />}
        {activeTab === 'settings' && (
          <SettingsPanel />
        )}
      </AnimatePresence>
    </Layout>
  );
}

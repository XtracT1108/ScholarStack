import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { GarrettModule } from './components/GarrettModule';
import { auth, signInWithGoogle } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Calculator, BarChart3, Shield, Zap, ChevronRight, Github } from 'lucide-react';
import { cn } from './lib/utils';


const LandingPage = ({ onSignIn, isSigningIn }: { onSignIn: () => void, isSigningIn: boolean }) => {
  const { scrollY } = useScroll();

  // Parallax transform variables
  const heroY = useTransform(scrollY, [0, 800], [0, 250]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const cardY = useTransform(scrollY, [0, 800], [0, -100]);

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500/30 selection:text-sky-100 overflow-x-hidden">

      {/* Ambient Glowing Orbs */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-sky-500/5 blur-[120px] rounded-full pointer-events-none transform translate-x-1/2 -translate-y-1/3" />
      <div className="absolute top-[40vh] left-0 w-[40vw] h-[40vw] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none transform -translate-x-1/2" />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 px-6 py-5">
        <div className="max-w-6xl mx-auto flex justify-between items-center bg-slate-900/60 backdrop-blur-xl border border-slate-800 px-6 py-3 rounded-2xl shadow-sm">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-8 h-8 bg-sky-500/10 border border-sky-400/20 rounded-xl flex items-center justify-center text-sky-400 shadow-sm transition-transform duration-300 group-hover:scale-110">
              <Calculator size={16} />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">Scholar<span className="text-sky-400">Stack</span></span>
          </motion.div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-400">
              <a href="#features" className="hover:text-sky-400 transition-colors">Features</a>
              <a href="#methodology" className="hover:text-sky-400 transition-colors">Methodology</a>
            </div>
            <button
              onClick={onSignIn}
              disabled={isSigningIn}
              className="bg-sky-400 text-slate-950 px-5 py-2 rounded-xl font-bold text-sm hover:bg-sky-300 transition-all duration-300 active:scale-95 shadow-sm shadow-sky-500/20 disabled:opacity-50 disabled:bg-slate-800 disabled:text-slate-500"
            >
              {isSigningIn ? 'Connecting…' : 'Sign In'}
            </button>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="relative pt-40 pb-24 px-6 min-h-[90vh] flex items-center">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

            {/* Left copy with Parallax */}
            <motion.div style={{ y: heroY, opacity: heroOpacity }} className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-800 bg-slate-900/50 shadow-sm"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)] animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-sky-400">V2.4 — Precision Engine Active</span>
              </motion.div>

              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 }}
                  className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] text-white"
                >
                  Research ranked.<br />
                  <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">Precisely.</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16 }}
                  className="text-lg text-slate-400 max-w-md leading-relaxed"
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
                  className="w-full sm:w-auto bg-sky-400 text-slate-950 px-8 py-4 rounded-2xl font-bold text-sm hover:bg-sky-300 transition-all duration-300 active:scale-95 shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  Launch Terminal
                  <ChevronRight size={16} className="text-slate-900" />
                </button>
                <button className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-slate-700 bg-slate-800/50 font-bold text-sm text-slate-300 hover:border-sky-500/50 hover:text-sky-400 hover:bg-slate-800 transition-all duration-300">
                  Documentation
                </button>
              </motion.div>
            </motion.div>

            {/* Right — Parallax Preview Card */}
            <motion.div
              style={{ y: cardY }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
              className="hidden lg:block relative"
            >
              {/* Glowing backdrop for the card */}
              <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/10 to-indigo-500/10 blur-xl rounded-3xl" />

              <div className="relative bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl shadow-black/50 p-8 space-y-6 transform hover:scale-[1.02] hover:-rotate-1 transition-all duration-500">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Final Rankings</p>
                    <p className="text-sm font-bold text-white">Consumer Behavior Study</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-[10px] font-bold text-sky-400 uppercase tracking-widest">Complete</span>
                </div>
                <div className="space-y-3">
                  {[
                    { rank: 1, label: 'Product Quality', score: '87.4', color: 'bg-sky-400' },
                    { rank: 2, label: 'Price Sensitivity', score: '74.1', color: 'bg-sky-500/80' },
                    { rank: 3, label: 'Brand Perception', score: '61.8', color: 'bg-sky-600/60' },
                    { rank: 4, label: 'Distribution', score: '55.2', color: 'bg-slate-600' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.08 }}
                      className="flex items-center gap-3"
                    >
                      <span className="w-6 text-xs font-black text-slate-500 text-right">{item.rank}</span>
                      <div className="flex-1 h-7 bg-slate-900/80 border border-slate-700 rounded-xl overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${parseInt(item.score)}%` }}
                          transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                          className={`h-full ${item.color}`}
                        />
                        <span className="absolute inset-0 flex items-center px-3 text-xs font-semibold text-white drop-shadow-md">{item.label}</span>
                      </div>
                      <span className="w-10 text-xs font-black text-slate-200 text-right">{item.score}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="pt-4 border-t border-slate-700 flex gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-[10px] font-bold text-slate-400">APA Table</span>
                  <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-[10px] font-bold text-slate-400">CSV</span>
                  <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-[10px] font-bold text-slate-400">Excel</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Feature strip */}
        <section id="features" className="relative py-24 px-6 border-t border-slate-800 bg-slate-900/50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-sky-400 mb-3">Capabilities</p>
              <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-white mb-4">Built for academic rigour.</h2>
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
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group p-8 bg-slate-800 border border-slate-700 rounded-3xl hover:border-sky-500/50 hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 ease-in-out hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400 mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:bg-sky-400 group-hover:text-slate-900">
                    <item.icon size={20} />
                  </div>
                  <h3 className="font-bold text-white mb-3 text-lg">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-slate-800 bg-slate-950">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-sky-400 border border-slate-800">
                <Calculator size={14} />
              </div>
              <span className="font-bold text-white">ScholarStack</span>
              <span className="text-slate-600 text-xs">·</span>
              <span className="text-xs text-slate-400">© 2026</span>
              <a href="https://xtract.website" target="_blank" rel="noreferrer" className="text-xs font-bold text-slate-400 hover:text-sky-400 transition-colors">
                XtracT
              </a>
            </div>
            <div className="flex items-center gap-6 text-xs font-semibold text-slate-500">
              <a href="#" className="hover:text-sky-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-sky-400 transition-colors">Terms</a>
              <a href="https://github.com/XtracT1108/ScholarStack" target="_blank" rel="noreferrer" className="hover:text-sky-400 transition-colors flex items-center gap-1.5">
                <Github size={14} /> GitHub
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

const SettingsPanel = () => {
  return (
    <div className="max-w-2xl mx-auto bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-6 shadow-sm">
      <h2 className="text-2xl font-bold text-white">Settings</h2>
      <div className="space-y-4">
        {/* Export Format */}
        <div className="flex items-center justify-between p-4 bg-slate-900 bg-slate-800 rounded-2xl">
          <div>
            <p className="font-bold text-white">Export Format</p>
            <p className="text-xs text-slate-500 text-slate-400">Default citation style for exports</p>
          </div>
          <select className=" bg-slate-700 text-slate-100 border border-slate-600 rounded-lg px-3 py-1 text-sm font-medium">
            <option>APA 7th Edition</option>
            <option>MLA 9th Edition</option>
            <option>Chicago</option>
          </select>
        </div>
        {/* App Info */}
        <div className="p-4 bg-indigo-50 bg-indigo-950/40 rounded-2xl border border-indigo-100 border-indigo-900">
          <p className="text-sm font-bold text-indigo-700 text-indigo-400">ScholarStack v2.4.0</p>
          <p className="text-xs text-indigo-500 text-indigo-500 mt-1">Academic Research Engine — Alpha</p>
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
  const [activeSession, setActiveSession] = useState<any>(null);

  useEffect(() => {
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
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
            onNewSession={() => {
              setActiveSession(null);
              setActiveTab('garrett');
            }}
            onViewSession={(session) => {
              console.log("Viewing session:", session.id);
              setActiveSession(session);
              setActiveTab('garrett');
            }}
            userId={user?.uid}
          />
        )}
        {activeTab === 'garrett' && <GarrettModule initialSession={activeSession} />}
        {activeTab === 'settings' && (
          <SettingsPanel />
        )}
      </AnimatePresence>
    </Layout>
  );
}

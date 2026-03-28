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
  <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden relative">
    {/* Premium Background Architecture */}
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-indigo-200/20 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-100/30 rounded-full blur-[100px] translate-y-1/3" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30 L30 0 M30 30 L60 30 M30 30 L30 60 M30 30 L0 30' fill='none' stroke='%234338ca' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }}
      />
    </div>

    <nav className="fixed top-0 w-full z-50 px-6 py-6 transition-all duration-500">
      <div className="max-w-7xl mx-auto flex justify-between items-center bg-white/70 backdrop-blur-xl border border-white/50 px-8 py-4 rounded-[2rem] shadow-premium">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
            <Calculator size={20} />
          </div>
          <span className="font-black text-xl tracking-tighter uppercase">Scholar<span className="text-indigo-600">Stack</span></span>
        </motion.div>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
            <a href="#methodology" className="hover:text-indigo-600 transition-colors">Methodology</a>
            <a href="#intelligence" className="hover:text-indigo-600 transition-colors">Intelligence</a>
            <a href="#nodes" className="hover:text-indigo-600 transition-colors">Nodes</a>
          </div>

          <button
            onClick={onSignIn}
            disabled={isSigningIn}
            className="bg-indigo-600 text-white px-7 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 shadow-premium disabled:opacity-50"
          >
            {isSigningIn ? 'Connecting...' : 'Secure Intake'}
          </button>
        </div>
      </div>
    </nav>

    <main className="relative z-10">
      {/* Hero Section */}
      <section className="pt-56 pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-indigo-100 shadow-sm"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">V2.4 Precision Engine Active</span>
            </motion.div>

            <div className="space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-7xl md:text-[6.5rem] font-black tracking-tightest leading-[0.9] text-slate-900"
              >
                The Architecture of <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-indigo-900">Modern Research.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl text-slate-500 max-w-xl font-medium leading-relaxed"
              >
                ScholarStack synthesizes complex Garrett Ranking methodologies into a high-fidelity visual experience.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-6"
            >
              <button
                onClick={onSignIn}
                disabled={isSigningIn}
                className="w-full sm:w-auto bg-slate-900 text-white px-10 py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-black transition-all hover:scale-105 active:scale-95 shadow-premium flex items-center gap-3"
              >
                Launch Terminal
                <ChevronRight size={18} className="text-indigo-400" />
              </button>

              <button className="w-full sm:w-auto px-10 py-5 rounded-[1.5rem] bg-white border border-indigo-100 font-black text-sm uppercase tracking-widest text-slate-600 hover:bg-indigo-50 transition-all">
                Internal Documentation
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="grid grid-cols-2 gap-6 p-4">
              <div className="glass-card p-8 rounded-[3rem] shadow-premium border border-white/80 space-y-6 aspect-square flex flex-col justify-between group hover:bg-white transition-all duration-700">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 transition-transform group-hover:scale-110 group-hover:rotate-6">
                  <BarChart3 size={32} />
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-20 bg-indigo-600 rounded-full" />
                  <div className="h-2 w-full bg-slate-100 rounded-full" />
                  <div className="h-2 w-2/3 bg-slate-100 rounded-full" />
                </div>
              </div>

              <div className="bg-slate-900 p-8 rounded-[3rem] shadow-premium text-white flex flex-col justify-between aspect-square group hover:scale-[1.02] transition-transform duration-700">
                <Zap className="text-indigo-400 animate-pulse" size={32} />
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Calculation</p>
                  <h4 className="text-2xl font-bold leading-none">Instant <br /> Synthesis</h4>
                </div>
              </div>

              <div className="col-span-2 glass-card p-10 rounded-[3rem] shadow-premium border border-white/80 flex items-center justify-between group hover:bg-white transition-all duration-700">
                <div className="space-y-4 flex-1">
                  <div className="flex gap-2">
                    {[1, 2, 3].map(i => <div key={i} className="h-1.5 w-12 bg-indigo-100 rounded-full" />)}
                  </div>
                  <h4 className="text-3xl font-bold text-slate-800 tracking-tight">Publication Portal</h4>
                  <p className="text-slate-500 font-medium max-w-xs">High-fidelity reports ready for peer review.</p>
                </div>
                <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl transition-transform group-hover:scale-110 group-hover:-rotate-12 duration-700">
                  <Shield size={36} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Intelligence Grid */}
      <section id="intelligence" className="py-32 px-6 bg-slate-900 text-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -10 }}
              className="md:col-span-2 p-12 rounded-[3.5rem] bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 flex flex-col justify-between h-[500px]"
            >
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <Zap size={32} />
                </div>
                <h3 className="text-5xl font-black tracking-tighter">Garrett Synthesis Engine</h3>
                <p className="text-slate-400 text-xl max-w-xl">Automate complex statistical ranking with zero latency. Our engine processes hundreds of data points using verified academic formulas.</p>
              </div>
              <div className="flex gap-4">
                <span className="px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-black uppercase tracking-widest">Statistical Rigor</span>
                <span className="px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-black uppercase tracking-widest">Real-time</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="p-12 rounded-[3.5rem] bg-indigo-600 border border-indigo-500 flex flex-col justify-between h-[500px]"
            >
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/40 flex items-center justify-center text-white">
                  <BarChart3 size={32} />
                </div>
                <h3 className="text-5xl font-black tracking-tighter">HD Export</h3>
                <p className="text-indigo-100 text-xl">Generate publication-quality reports instantly.</p>
              </div>
              <div className="w-full h-32 bg-white/10 rounded-3xl border border-white/20 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-4 bg-white/20" />
                <div className="p-6 space-y-2">
                  <div className="h-2 bg-white/40 w-3/4 rounded" />
                  <div className="h-2 bg-white/20 w-1/2 rounded" />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="p-10 rounded-[3.5rem] bg-white text-slate-900 border border-slate-200 flex flex-col gap-8 h-[400px] justify-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900">
                <Shield size={28} />
              </div>
              <h4 className="text-3xl font-black tracking-tighter">Auth Core</h4>
              <p className="text-slate-500 text-lg leading-snug">Secure cloud infrastructure powered by Firebase.</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="md:col-span-2 p-10 rounded-[3.5rem] bg-gradient-to-br from-slate-100 to-slate-200 text-slate-900 border border-slate-300/50 flex flex-col md:flex-row items-center gap-12 h-[400px]"
            >
              <div className="flex-1 space-y-4">
                <h4 className="text-4xl font-black tracking-tighter">Collaborative Terminal</h4>
                <p className="text-slate-600 text-lg">Cross-team research coordination and standardized data entry modules.</p>
                <div className="flex gap-2 pt-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-300 overflow-hidden shadow-sm">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black shadow-sm">+12</div>
                </div>
              </div>
              <div className="hidden lg:block w-72 h-48 bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden relative">
                <div className="absolute top-0 w-full h-2 bg-slate-50" />
                <div className="p-8 space-y-4">
                  <div className="h-3 bg-slate-100 rounded-full w-full" />
                  <div className="h-3 bg-slate-100 rounded-full w-5/6" />
                  <div className="h-3 bg-indigo-50 rounded-full w-4/6" />
                  <div className="pt-4 flex justify-between">
                    <div className="h-8 w-24 bg-slate-900 rounded-xl" />
                    <div className="h-8 w-8 bg-indigo-600 rounded-xl" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-slate-200 bg-white relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                <Calculator size={16} />
              </div>
              <span className="font-black text-xl tracking-tighter uppercase">ScholarStack</span>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed">
              The future of academic synthesis. <br />
              © 2026 Xtract Intelligence Systems
            </p>
          </div>

          <div className="flex gap-24">
            <div className="space-y-6">
              <h5 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Core</h5>
              <ul className="space-y-3 text-[11px] font-black uppercase tracking-widest text-slate-600">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Terminal</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Methods</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">API</a></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h5 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Protocols</h5>
              <ul className="space-y-3 text-[11px] font-black uppercase tracking-widest text-slate-600">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Safety</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Legal</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </main>
  </div>);

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

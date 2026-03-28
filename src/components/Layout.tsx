import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Calculator,
  History,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { cn } from '../lib/utils';
import { auth, signInWithGoogle } from '../lib/firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { useTheme } from '../lib/ThemeContext';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
  collapsed?: boolean;
  key?: string;
}

const NavItem = ({ icon: Icon, label, active, onClick, collapsed }: NavItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 w-full p-3.5 rounded-2xl transition-all duration-500 group relative overflow-hidden",
      active
        ? "bg-slate-900 text-white shadow-premium"
        : "text-slate-500 hover:bg-white/50 hover:text-slate-900"
    )}
  >
    {active && (
      <motion.div
        layoutId="nav-glow"
        className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 opacity-50"
      />
    )}
    <Icon size={22} className={cn("shrink-0 relative z-10 transition-transform duration-500", active ? "text-indigo-400" : "group-hover:scale-110 group-hover:rotate-6")} />
    {!collapsed && (
      <span className={cn(
        "font-display font-semibold text-sm tracking-tight relative z-10 transition-all duration-500",
        active ? "opacity-100 translate-x-0" : "opacity-80 group-hover:opacity-100 group-hover:translate-x-1"
      )}>
        {label}
      </span>
    )}
    {!collapsed && active && (
      <motion.div
        layoutId="active-dot"
        className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 relative z-10 shadow-[0_0_10px_rgba(129,140,248,0.8)]"
      />
    )}
  </button>
);

export const Layout = ({ children, activeTab, setActiveTab }: {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { isDark, toggle: toggleTheme } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      unsubscribe();
      window.removeEventListener('resize', checkMobile);
    };
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

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'garrett', label: 'Garrett Ranking', icon: Calculator },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-transparent flex text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 selection:text-indigo-700 overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-100/30 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-100/30 rounded-full blur-[120px] pointer-events-none" />

      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="relative z-40 h-screen sticky top-0 p-4">
          <motion.div
            initial={false}
            animate={{ width: isSidebarOpen ? 280 : 92 }}
            className="glass-card dark:bg-slate-900/80 dark:border-slate-700/50 h-full flex flex-col rounded-[3rem] border border-white/60 shadow-premium overflow-hidden relative"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Sidebar Background Accents */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none" />

            {/* Logo Section */}
            <div className="p-8 pb-4 relative z-10">
              <AnimatePresence mode="wait">
                {isSidebarOpen ? (
                  <motion.div
                    key="logo-expanded"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-12 h-12 bg-slate-900 rounded-[1.25rem] flex items-center justify-center text-white shadow-2xl relative group overflow-hidden active:scale-95 transition-transform">
                      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <Calculator size={24} className="text-indigo-400 relative z-10" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-display font-black text-2xl leading-none tracking-tighter bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent">
                        ScholarStack
                      </span>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Research Engine</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="logo-collapsed"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-2xl mx-auto relative group overflow-hidden active:scale-90 transition-transform"
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Calculator size={26} className="text-indigo-400 relative z-10" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2 mt-8 relative z-10">
              <div className="px-4 mb-4 flex items-center justify-between">
                <span className={cn(
                  "text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] transition-opacity duration-500",
                  !isSidebarOpen && "opacity-0"
                )}>
                  Research Core
                </span>
                {isSidebarOpen && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />}
              </div>
              {navItems.map((item) => (
                <NavItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  active={activeTab === item.id}
                  onClick={() => setActiveTab(item.id)}
                  collapsed={!isSidebarOpen}
                />
              ))}

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={cn(
                  "flex items-center gap-3 w-full p-3.5 rounded-2xl transition-all duration-500 group relative overflow-hidden mt-2",
                  "text-slate-500 hover:bg-white/50 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                {isDark ? (
                  <Sun size={22} className="shrink-0 relative z-10 text-amber-400 group-hover:scale-110 transition-transform" />
                ) : (
                  <Moon size={22} className="shrink-0 relative z-10 group-hover:scale-110 group-hover:rotate-6 transition-transform" />
                )}
                {!isSidebarOpen ? null : (
                  <span className="font-display font-semibold text-sm tracking-tight relative z-10 opacity-80 group-hover:opacity-100">
                    {isDark ? 'Light Mode' : 'Dark Mode'}
                  </span>
                )}
              </button>
            </nav>

            {/* System Status / Meta */}
            {isSidebarOpen && (
              <div className="px-8 py-6 space-y-4">
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/50 space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-indigo-600">
                    <span>Engine Alpha</span>
                    <span>v2.4.0</span>
                  </div>
                  <div className="w-full h-1 bg-indigo-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                      className="h-full bg-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* User Profile */}
            <div className="p-4 border-t border-indigo-50/50 mt-auto relative z-10">
              {user ? (
                <div className={cn(
                  "flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-500 group/user",
                  isSidebarOpen ? "bg-white/60 border border-white shadow-sm hover:shadow-md hover:bg-white" : "justify-center"
                )}>
                  <div className="relative group cursor-pointer">
                    <img src={user.photoURL || ''} alt="User" className="w-11 h-11 rounded-[1rem] border-2 border-white shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3" referrerPolicy="no-referrer" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
                  </div>
                  {isSidebarOpen && (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-slate-900 truncate leading-tight">{user.displayName}</p>
                      <button onClick={() => signOut(auth)} className="text-[10px] font-black text-indigo-500 hover:text-indigo-600 uppercase tracking-widest mt-1 inline-flex items-center gap-1 group/out">
                        Sign Out
                        <ChevronRight size={10} className="group-hover/out:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleSignIn}
                  disabled={isSigningIn}
                  className={cn(
                    "flex items-center gap-3 w-full p-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-premium",
                    !isSidebarOpen && "justify-center"
                  )}
                >
                  <User size={20} className="text-indigo-400" />
                  {isSidebarOpen && <span className="uppercase text-[11px] tracking-widest font-black">{isSigningIn ? 'Connecting...' : 'Secure Intake'}</span>}
                </button>
              )}
            </div>

            {/* Collapse Toggle */}
            <div className="px-4 py-6 border-t border-indigo-50/50 relative z-10">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="flex items-center transition-all duration-500 w-full"
              >
                {isSidebarOpen ? (
                  <div className="flex items-center gap-3 w-full p-3.5 rounded-2xl text-slate-400 hover:text-slate-900 hover:bg-white/50 group/toggle">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center group-hover/toggle:bg-white transition-colors">
                      <ChevronRight size={16} className="rotate-180" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Minimize Workspace</span>
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto hover:bg-white transition-all shadow-sm hover:shadow-md text-slate-400 hover:text-indigo-600 group/toggle">
                    <Menu size={24} className="group-hover/toggle:scale-110 transition-transform" />
                  </div>
                )}
              </button>
            </div>
          </motion.div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile Header */}
        {isMobile && (
          <header className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold">
                <Calculator size={18} className="text-indigo-400" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight">ScholarStack</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
              </button>
              {user && (
                <div className="flex items-center gap-3">
                  <img src={user.photoURL || ''} alt="User" className="w-8 h-8 rounded-xl border border-slate-200" referrerPolicy="no-referrer" />
                  <button onClick={() => signOut(auth)} className="p-2 text-slate-400">
                    <LogOut size={18} />
                  </button>
                </div>
              )}
            </div>
          </header>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-[1600px] mx-auto p-4 lg:p-10 lg:pt-8 pb-32 lg:pb-10 h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Bottom Nav */}
        {isMobile && (
          <nav className="fixed bottom-6 left-6 right-6 p-2 glass-card rounded-3xl border border-white/40 shadow-premium flex items-center justify-around z-50">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 px-6 py-2.5 rounded-2xl transition-all duration-300 relative",
                  activeTab === item.id ? "text-indigo-600 scale-110" : "text-slate-400"
                )}
              >
                {activeTab === item.id && (
                  <motion.div
                    layoutId="mobile-nav-bg"
                    className="absolute inset-0 bg-indigo-50 rounded-2xl -z-10"
                  />
                )}
                <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                <span className="text-[9px] font-bold uppercase tracking-widest">{item.label}</span>
              </button>
            ))}
          </nav>
        )}
      </main>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, orderBy, limit, getDocs, Timestamp, addDoc, serverTimestamp } from 'firebase/firestore';
import { DateEntry } from './types';
import { format, addDays, startOfDay } from 'date-fns';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';
import DOMPurify from 'dompurify';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  LogOut,
  LayoutDashboard,
  Gift,
  Sparkles,
  ChevronLeft,
  Ticket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouletteWheel } from '@/components/RouletteWheel';
import { GHLModal } from '@/components/GHLModal';
import { AdminLogin } from '@/components/AdminLogin';
import { AdminDashboard } from '@/components/AdminDashboard';
import { AdminEntryForm } from '@/components/AdminEntryForm';
import { LabelManager } from '@/components/LabelManager';
import { ResultPage } from '@/components/ResultPage';
import { SuccessPage } from '@/components/SuccessPage';
import { Footer } from '@/components/Footer';
import { motion, AnimatePresence } from 'motion/react';

const TIMEZONE = 'Asia/Kuala_Lumpur';

const DEFAULT_LABELS = [
  'Travel', 'Meditation', 'Meeting People', 'Closing Deals', 'Tackle Obstacles', 
  'Reading', 'Sports', 'Propose', 'Getting Married', 'Study', 'Renovate', 
  'Move House', 'Relocate', 'Trading', 'Investment', 'Launch New Business', 
  'Post Social Media', 'Dating', 'Shopping', 'Sleeping', 'Watch Movie', 
  'Cafe Hopping', 'Working', 'Leisure'
];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [view, setView] = useState<'public' | 'admin-list' | 'admin-form' | 'admin-labels' | 'result' | 'success'>('public');
  const [editingEntry, setEditingEntry] = useState<DateEntry | null>(null);
  
  // Public State
  const [nearestEntry, setNearestEntry] = useState<DateEntry | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wheelLabels, setWheelLabels] = useState<string[]>([]);
  const [targetIndex, setTargetIndex] = useState(0);

  useEffect(() => {
    console.log('App: Initializing...');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('App: Auth state changed', user?.email);
      setUser(user);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthReady) return;
    
    const initializeData = async () => {
      console.log('App: Initializing data...');
      // 1. Fetch/Seed Labels
      let labelsList: string[] = [];
      try {
        const labelsQ = query(collection(db, 'activity_labels'), orderBy('created_at', 'asc'));
        const snapshot = await getDocs(labelsQ);
        
        if (snapshot.empty) {
          // Seed default labels
          const batch = DEFAULT_LABELS.map((name, index) => 
            addDoc(collection(db, 'activity_labels'), {
              name,
              order: index,
              created_at: serverTimestamp()
            })
          );
          await Promise.all(batch);
          labelsList = DEFAULT_LABELS;
        } else {
          labelsList = snapshot.docs.map(doc => doc.data().name);
        }
        setWheelLabels(labelsList);
      } catch (error) {
        console.error("Error fetching/seeding labels:", error);
      }

      // 2. Determine view based on path
      const path = window.location.pathname;
      if (path.startsWith('/admin')) {
        setView('admin-list');
      } else if (path === '/result') {
        setView('result');
        fetchNearestEntry(labelsList);
      } else if (path === '/success') {
        setView('success');
      } else {
        setView('public');
        fetchNearestEntry(labelsList);
      }
    };

    initializeData();
  }, [isAuthReady]);

  const fetchNearestEntry = async (currentLabels?: string[]) => {
    try {
      const nowKL = toZonedTime(new Date(), TIMEZONE);
      const todayStart = startOfDay(nowKL);
      const todayTimestamp = Timestamp.fromDate(todayStart);

      const q = query(
        collection(db, 'date_entries'),
        where('status', '==', 'published'),
        where('entry_date', '>=', todayTimestamp),
        orderBy('entry_date', 'asc'),
        limit(1)
      );

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const entry = {
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data()
        } as DateEntry;
        setNearestEntry(entry);

        // Calculate target index based on assigned label
        if (currentLabels && entry.label_id) {
          // Need to get the label name for the ID
          const labelDoc = await getDocs(query(collection(db, 'activity_labels')));
          const labelName = labelDoc.docs.find(d => d.id === entry.label_id)?.data().name;
          
          if (labelName) {
            const index = currentLabels.indexOf(labelName);
            if (index !== -1) {
              setTargetIndex(index);
            }
          }
        }
      } else {
        setNearestEntry(null);
        setTargetIndex(0);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'date_entries');
    }
  };

  const handleLogout = () => {
    auth.signOut();
  };

  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setView('admin-list');
  };

  const navigateToPublic = async () => {
    window.history.pushState({}, '', '/');
    setView('public');
    
    // Refresh labels and entry
    const labelsQ = query(collection(db, 'activity_labels'), orderBy('created_at', 'asc'));
    const snapshot = await getDocs(labelsQ);
    const labelsList = snapshot.docs.map(doc => doc.data().name);
    setWheelLabels(labelsList);
    fetchNearestEntry(labelsList);
  };

  const handleSpinEnd = () => {
    setTimeout(() => {
      window.history.pushState({}, '', '/result');
      setView('result');
    }, 1000); // Small delay for impact
  };

  const navigateToSuccess = () => {
    window.history.pushState({}, '', '/success');
    setView('success');
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#4a0404]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c5a059]"></div>
      </div>
    );
  }

  // Admin View Logic
  if (view.startsWith('admin') || window.location.pathname.startsWith('/admin')) {
    if (!user || user.email !== 'cody.lim@joeyyap.com') {
      return <AdminLogin />;
    }

    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white border-b sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <div className="flex items-center gap-2 cursor-pointer" onClick={navigateToPublic}>
                  <Sparkles className="h-6 w-6 text-[#4a0404]" />
                  <span className="font-bold text-xl tracking-tight uppercase">Admin Panel</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500 hidden sm:inline">{user.email}</span>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </Button>
                </div>
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {view === 'admin-list' ? (
              <AdminDashboard 
                onAdd={() => setView('admin-form')}
                onEdit={(entry) => {
                  setEditingEntry(entry);
                  setView('admin-form');
                }}
                onManageLabels={() => setView('admin-labels')}
              />
            ) : view === 'admin-form' ? (
              <AdminEntryForm 
                entry={editingEntry}
                onBack={() => {
                  setEditingEntry(null);
                  setView('admin-list');
                }}
                onManageLabels={() => setView('admin-labels')}
              />
            ) : (
              <div className="space-y-6">
                <Button variant="ghost" onClick={() => setView('admin-list')} className="mb-4">
                  <ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>
                <LabelManager />
              </div>
            )}
          </main>
        </div>
      </ErrorBoundary>
    );
  }

  // Public View
  if (view === 'success') {
    return (
      <ErrorBoundary>
        <SuccessPage />
      </ErrorBoundary>
    );
  }

  if (view === 'result') {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-[#4a0404] text-white font-sans selection:bg-[#c5a059] selection:text-black">
          <header className="fixed top-0 w-full z-50 bg-[#4a0404]/90 backdrop-blur-md border-b border-[#c5a059]/20">
            <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
              <div className="flex items-center gap-3 cursor-pointer" onClick={navigateToPublic}>
                <div className="w-10 h-10 bg-[#c5a059] rounded-sm flex items-center justify-center transform rotate-45">
                  <Sparkles className="h-6 w-6 text-[#4a0404] transform -rotate-45" />
                </div>
                <span className="font-heading text-2xl font-bold tracking-tight text-[#c5a059]">DESTINY WHEEL</span>
              </div>
            </div>
          </header>

          <ResultPage 
            entry={nearestEntry} 
            onReset={navigateToPublic}
            onClaim={() => setIsModalOpen(true)}
            onSuccess={navigateToSuccess}
          />

          <Footer />

          <GHLModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
          />
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#4a0404] text-white font-sans selection:bg-[#c5a059] selection:text-black relative overflow-hidden">
        {/* Background Texture/Overlay */}
        <div className="absolute inset-0 bg-black opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#4a0404]/80 via-[#4a0404] to-[#4a0404]" />

        {/* Header */}
        <header className="fixed top-0 w-full z-50 bg-[#4a0404]/90 backdrop-blur-md border-b border-[#c5a059]/20">
          <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="https://www.joeyyap.com/App_Themes/JoeyYap/images/logo-jy-gold.png" 
                alt="Joey Yap Logo" 
                className="h-12 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
              <span className="font-heading text-2xl font-bold tracking-tight text-[#c5a059]">DESTINY WHEEL</span>
            </div>
          </div>
        </header>

        <main className="relative pt-40 pb-24 px-4">
          <div className="max-w-5xl mx-auto text-center space-y-16">
            {/* Hero Section */}
            <div className="space-y-8">
              <div className="space-y-4">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-6xl md:text-8xl font-heading font-bold tracking-tight leading-[0.9] text-white"
                >
                  Discover The <span className="text-[#c5a059]">Timing</span> <br />
                  <span className="italic font-normal">Framework.</span>
                </motion.h1>
                <div className="h-1 w-32 bg-[#c5a059] mx-auto rounded-full" />
              </div>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed"
              >
                Same Effort. Completely Different Results. <br />
                <span className="text-white font-medium">Here's Why Timing Changes Everything.</span>
              </motion.p>
            </div>

            {/* Roulette Section */}
            <div className="py-12 relative">
              {/* Decorative Rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#c5a059]/10 rounded-full hidden md:block pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-[#c5a059]/5 rounded-full hidden md:block pointer-events-none" />
              
              <RouletteWheel 
                isSpinning={isSpinning}
                setIsSpinning={setIsSpinning}
                onSpinEnd={handleSpinEnd} 
                labels={wheelLabels}
                targetIndex={targetIndex}
              />
            </div>
          </div>
        </main>

        <Footer />

        <GHLModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </div>
    </ErrorBoundary>
  );
}

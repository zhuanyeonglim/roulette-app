import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import DOMPurify from 'dompurify';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Sparkles,
  RotateCcw,
  Briefcase,
  Coins,
  Plane,
  MessageSquareX,
  HeartPulse,
  PlusSquare,
  Zap,
  Mouse,
  Bird,
  Cloud,
  Smile,
  Stethoscope,
  FileSignature,
  Rocket,
  Store,
  Share2,
  Heart,
  ShoppingBag,
  Moon,
  Film,
  Coffee,
  Dumbbell,
  Hammer,
  Home,
  BookOpen,
  Users,
  Handshake,
  Mountain,
  Trophy,
  Utensils,
  Camera
} from 'lucide-react';
import { 
  GiRat, 
  GiBull, 
  GiTiger, 
  GiRabbit, 
  GiDragonHead, 
  GiSnake, 
  GiHorseHead, 
  GiGoat, 
  GiMonkey, 
  GiRooster, 
  GiSittingDog, 
  GiPig,
  GiPrayer,
  GiCoins
} from 'react-icons/gi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DateEntry } from '@/types';
import { ClaimSeatSection } from './ClaimSeatSection';

interface ResultPageProps {
  entry: DateEntry | null;
  onReset: () => void;
  onClaim: () => void;
  onSuccess?: () => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({ entry, onReset, onClaim, onSuccess }) => {
  const claimSectionRef = useRef<HTMLDivElement>(null);

  const scrollToClaim = () => {
    claimSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const parseListItems = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const items = Array.from(doc.querySelectorAll('li')).map(li => {
      const text = li.textContent || '';
      // Try to split by colon or dash for description
      const parts = text.split(/[:\-]/);
      const title = parts[0].trim();
      const description = parts.slice(1).join(':').trim();
      
      // Split title into Chinese and English
      const chineseRegex = /[\u4e00-\u9fa5]+/g;
      const chineseMatch = title.match(chineseRegex);
      const chinese = chineseMatch ? chineseMatch.join(' ') : '';
      const english = title.replace(chineseRegex, '').trim();
      
      return { chinese, english, description, original: text };
    });

    if (items.length === 0 && html) {
      const plainText = html.replace(/<[^>]*>/g, '');
      return plainText.split(/[.\n]/).filter(s => s.trim().length > 2).map(s => {
        const text = s.trim();
        const chineseRegex = /[\u4e00-\u9fa5]+/g;
        const chineseMatch = text.match(chineseRegex);
        const chinese = chineseMatch ? chineseMatch.join(' ') : '';
        const english = text.replace(chineseRegex, '').trim();
        return { chinese, english, description: '', original: text };
      });
    }
    return items;
  };

  const getIconForActivity = (text: string) => {
    const lower = text.toLowerCase();
    
    // Health & Medical
    if (lower.includes('medical') || lower.includes('doctor') || lower.includes('treatment') || lower.includes('surgery') || lower.includes('求医')) return <Stethoscope className="h-8 w-8" />;
    if (lower.includes('health') || lower.includes('heart')) return <HeartPulse className="h-8 w-8" />;
    
    // Business & Career
    if (lower.includes('contract') || lower.includes('agreement') || lower.includes('sign') || lower.includes('立约')) return <FileSignature className="h-8 w-8" />;
    if (lower.includes('business') || lower.includes('launch') || lower.includes('commence') || lower.includes('开市')) return <Rocket className="h-8 w-8" />;
    if (lower.includes('career') || lower.includes('work') || lower.includes('job')) return <Briefcase className="h-8 w-8" />;
    if (lower.includes('deal') || lower.includes('handshake') || lower.includes('closing')) return <Handshake className="h-8 w-8" />;
    if (lower.includes('store') || lower.includes('shop')) return <Store className="h-8 w-8" />;
    if (lower.includes('meeting') || lower.includes('people') || lower.includes('users') || lower.includes('会友')) return <Users className="h-8 w-8" />;
    
    // Finance & Wealth
    if (lower.includes('debt collection') || lower.includes('collect') || lower.includes('纳财')) return <div className="h-8 w-8"><GiCoins size={32} /></div>;
    if (lower.includes('finance') || lower.includes('money') || lower.includes('invest') || lower.includes('trading') || lower.includes('coins') || lower.includes('出财')) return <Coins className="h-8 w-8" />;
    if (lower.includes('wealth') || lower.includes('gold')) return <Trophy className="h-8 w-8" />;
    
    // Travel & Movement
    if (lower.includes('travel') || lower.includes('journey') || lower.includes('relocate') || lower.includes('plane') || lower.includes('出行')) return <Plane className="h-8 w-8" />;
    if (lower.includes('move house') || lower.includes('home') || lower.includes('relocation') || lower.includes('移徙')) return <Home className="h-8 w-8" />;
    
    // Social & Relationship
    if (lower.includes('social') || lower.includes('post') || lower.includes('share')) return <Share2 className="h-8 w-8" />;
    if (lower.includes('date') || lower.includes('dating') || lower.includes('love') || lower.includes('heart')) return <Heart className="h-8 w-8" />;
    if (lower.includes('marry') || lower.includes('wedding') || lower.includes('propose') || lower.includes('嫁娶')) return <Heart className="h-8 w-8" />;
    
    // Leisure & Lifestyle
    if (lower.includes('shopping') || lower.includes('buy')) return <ShoppingBag className="h-8 w-8" />;
    if (lower.includes('sleep') || lower.includes('night') || lower.includes('moon')) return <Moon className="h-8 w-8" />;
    if (lower.includes('movie') || lower.includes('film') || lower.includes('watch')) return <Film className="h-8 w-8" />;
    if (lower.includes('cafe') || lower.includes('coffee')) return <Coffee className="h-8 w-8" />;
    if (lower.includes('food') || lower.includes('eat') || lower.includes('restaurant')) return <Utensils className="h-8 w-8" />;
    
    // Education & Knowledge
    if (lower.includes('study') || lower.includes('read') || lower.includes('book') || lower.includes('learning')) return <BookOpen className="h-8 w-8" />;
    
    // Physical & Construction
    if (lower.includes('groundbreaking') || lower.includes('dig') || lower.includes('earth') || lower.includes('动土')) return <Hammer className="h-8 w-8" />;
    if (lower.includes('renovate') || lower.includes('hammer') || lower.includes('construction') || lower.includes('修造')) return <Hammer className="h-8 w-8" />;
    if (lower.includes('sport') || lower.includes('gym') || lower.includes('exercise') || lower.includes('dumbbell')) return <Dumbbell className="h-8 w-8" />;
    if (lower.includes('obstacle') || lower.includes('tackle') || lower.includes('mountain')) return <Mountain className="h-8 w-8" />;
    if (lower.includes('trophy') || lower.includes('win') || lower.includes('success')) return <Trophy className="h-8 w-8" />;
    
    // Spiritual & Ritual
    if (lower.includes('pray') || lower.includes('worship') || lower.includes('ritual') || lower.includes('祭祀')) return <div className="h-8 w-8"><GiPrayer size={32} /></div>;
    
    // Negative & Dissolve
    if (lower.includes('dispute') || lower.includes('argument') || lower.includes('avoid') || lower.includes('dont') || lower.includes('dissolve') || lower.includes('disengage') || lower.includes('解除')) return <MessageSquareX className="h-8 w-8" />;
    
    // Misc
    if (lower.includes('photo') || lower.includes('camera')) return <Camera className="h-8 w-8" />;
    
    return <Sparkles className="h-8 w-8 opacity-50" />;
  };

  const getAnimalIcon = (name: string) => {
    const lower = name.toLowerCase();
    const iconSize = 24;
    const iconClass = "h-6 w-6";
    
    const wrapIcon = (Icon: any) => (
      <div className={iconClass}>
        <Icon size={iconSize} />
      </div>
    );

    if (lower.includes('rat')) return wrapIcon(GiRat);
    if (lower.includes('ox')) return wrapIcon(GiBull);
    if (lower.includes('tiger')) return wrapIcon(GiTiger);
    if (lower.includes('rabbit')) return wrapIcon(GiRabbit);
    if (lower.includes('dragon')) return wrapIcon(GiDragonHead);
    if (lower.includes('snake')) return wrapIcon(GiSnake);
    if (lower.includes('horse')) return wrapIcon(GiHorseHead);
    if (lower.includes('goat') || lower.includes('sheep')) return wrapIcon(GiGoat);
    if (lower.includes('monkey')) return wrapIcon(GiMonkey);
    if (lower.includes('rooster') || lower.includes('bird')) return wrapIcon(GiRooster);
    if (lower.includes('dog')) return wrapIcon(GiSittingDog);
    if (lower.includes('pig')) return wrapIcon(GiPig);
    return <Sparkles className="h-6 w-6" />;
  };

  if (!entry) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#4a0404]">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="p-16 bg-black/40 backdrop-blur-xl border-2 border-dashed border-[#c5a059]/30 shadow-2xl">
            <p className="text-2xl font-heading text-white/70">
              No upcoming dates available yet. <br />
              <span className="text-[#c5a059]">Please check back later!</span>
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={onReset}
            className="border-[#c5a059] text-[#c5a059] hover:bg-[#c5a059] hover:text-black px-10 py-8 text-lg font-bold uppercase tracking-widest"
          >
            <RotateCcw className="mr-3 h-5 w-5" /> BACK TO WHEEL
          </Button>
        </div>
      </div>
    );
  }

  const suitItems = parseListItems(entry.do_text || '');
  const avoidItems = parseListItems(entry.dont_text || '');

  return (
    <div className="min-h-screen bg-[#4a0404] text-white font-sans selection:bg-[#c5a059] selection:text-black relative overflow-hidden flex flex-col items-center">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#4a0404]/90 to-black z-10" />
        <img 
          src="https://picsum.photos/seed/destiny/1920/1080?blur=5" 
          alt="Background" 
          className="w-full h-full object-cover opacity-40 scale-110"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#c5a059]/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#c5a059]/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl w-full mx-auto px-4 pt-32 pb-24 relative z-10 flex flex-col items-center">
        {/* Header Reveal */}
        <div className="text-center space-y-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-4 px-8 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
          >
            <Sparkles className="h-5 w-5 text-[#c5a059]" />
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-[#c5a059]">
              The Universe Has Decided
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-9xl font-heading font-bold tracking-tight leading-[0.85] text-white"
          >
            YOUR <span className="text-[#c5a059] italic font-normal">DESTINY</span> <br />
            IS REVEALED.
          </motion.h1>
        </div>

        {/* The Main Result Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.4, type: 'spring', damping: 20 }}
          className="w-full max-w-5xl relative"
        >
          {/* Intricate Border Decoration */}
          <div className="absolute -inset-4 border-[1px] border-[#c5a059]/30 pointer-events-none rounded-sm" />
          <div className="absolute -inset-2 border-[2px] border-[#c5a059]/50 pointer-events-none rounded-sm" />
          
          {/* Corner Accents */}
          <div className="absolute -top-6 -left-6 w-12 h-12 border-t-2 border-l-2 border-[#c5a059] pointer-events-none" />
          <div className="absolute -top-6 -right-6 w-12 h-12 border-t-2 border-r-2 border-[#c5a059] pointer-events-none" />
          <div className="absolute -bottom-6 -left-6 w-12 h-12 border-b-2 border-l-2 border-[#c5a059] pointer-events-none" />
          <div className="absolute -bottom-6 -right-6 w-12 h-12 border-b-2 border-r-2 border-[#c5a059] pointer-events-none" />

          <div className="relative bg-[#1a0a0a] border border-[#c5a059]/30 flex flex-col md:flex-row shadow-2xl overflow-hidden min-h-[700px]">
            
            {/* Left Sidebar */}
            <div className="w-full md:w-32 bg-black/40 border-r border-[#c5a059]/20 flex flex-col items-center py-8 gap-8">
              {/* Date Display */}
              <div className="text-center space-y-1 pb-6 border-b border-[#c5a059]/20 w-full">
                <p className="text-[#c5a059] text-xs font-bold uppercase tracking-widest">
                  {format(entry.entry_date.toDate(), 'MMM')}
                </p>
                <p className="text-white text-4xl font-heading font-bold">
                  {format(entry.entry_date.toDate(), 'dd')}
                </p>
              </div>

              {/* Animal Signs List */}
              <div className="flex flex-col gap-6 items-center w-full px-2">
                {entry.animal_signs?.map((sign, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1 group cursor-default">
                    <div className="w-14 h-14 rounded-full border border-[#c5a059]/30 bg-black/40 flex items-center justify-center text-[#c5a059] group-hover:border-[#c5a059] transition-colors shadow-inner">
                      {getAnimalIcon(sign)}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-tighter text-white/60 group-hover:text-[#c5a059] transition-colors">
                      {sign}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-8 md:p-12 flex flex-col gap-10 bg-gradient-to-br from-[#2a0a0a] to-[#1a0505]">
              {/* Header Title */}
              <div className="text-center space-y-2 overflow-hidden">
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-[#c5a059] tracking-tight uppercase leading-tight drop-shadow-lg break-words">
                  {entry.title || 'YOUR DESTINY DATE'}
                </h2>
              </div>

              {/* Suit Section */}
              <div className="space-y-8 bg-white/[0.03] border border-white/10 p-8 rounded-xl backdrop-blur-sm">
                <h3 className="text-[#c5a059] text-sm font-bold uppercase tracking-[0.4em] border-b border-[#c5a059]/20 pb-4">
                  SUIT 宜
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
                  {suitItems.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center gap-4 group">
                      <div className="w-16 h-16 rounded-full border border-[#c5a059]/40 bg-black/40 flex items-center justify-center text-[#c5a059] group-hover:scale-110 transition-transform shadow-lg shrink-0">
                        {getIconForActivity(item.original)}
                      </div>
                      <div className="space-y-2 w-full flex flex-col items-center max-w-[200px] mx-auto">
                        <div className="flex flex-col gap-1 w-full overflow-hidden">
                          <p className="text-[#c5a059] font-bold text-2xl leading-tight">{item.chinese}</p>
                          <p className="text-white font-medium text-[10px] sm:text-xs uppercase tracking-[0.05em] leading-tight opacity-80 line-clamp-2 min-h-[2.5em] flex items-center justify-center px-1">
                            {item.english}
                          </p>
                        </div>
                        {item.description && (
                          <p className="text-white/40 text-[11px] leading-tight font-light line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Avoid Section */}
              <div className="space-y-8 bg-white/[0.03] border border-white/10 p-8 rounded-xl backdrop-blur-sm">
                <h3 className="text-white/60 text-sm font-bold uppercase tracking-[0.4em] border-b border-white/10 pb-4">
                  AVOID 忌
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
                  {avoidItems.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center gap-4 group">
                      <div className="w-16 h-16 rounded-full border border-white/20 bg-black/40 flex items-center justify-center text-white/40 group-hover:scale-110 transition-transform shadow-lg shrink-0">
                        {getIconForActivity(item.original)}
                      </div>
                      <div className="space-y-2 w-full flex flex-col items-center max-w-[200px] mx-auto">
                        <div className="flex flex-col gap-1 w-full overflow-hidden">
                          <p className="text-white/60 font-bold text-2xl leading-tight">{item.chinese}</p>
                          <p className="text-white/30 font-medium text-[10px] sm:text-xs uppercase tracking-[0.05em] leading-tight line-clamp-2 min-h-[2.5em] flex items-center justify-center px-1">
                            {item.english}
                          </p>
                        </div>
                        {item.description && (
                          <p className="text-white/30 text-[11px] leading-tight font-light line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-16 w-full max-w-2xl"
        >
          <Button 
            onClick={scrollToClaim}
            className="w-full bg-transparent border-2 border-[#c5a059]/60 hover:border-[#c5a059] text-[#c5a059] hover:bg-[#c5a059]/10 py-8 text-lg font-bold rounded-xl transition-all duration-300 group shadow-[0_0_30px_rgba(197,160,89,0.1)]"
          >
            Claim Your Free Seat
            <ArrowRight className="ml-4 h-5 w-5 transition-transform group-hover:translate-x-2" />
          </Button>
          
          <div className="mt-8 flex justify-center">
            <Button 
              variant="ghost" 
              onClick={onReset}
              className="text-white/40 hover:text-[#c5a059] uppercase tracking-widest text-[10px] font-bold"
            >
              <RotateCcw className="mr-2 h-3 w-3" /> Spin Again
            </Button>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 text-[10px] font-bold uppercase tracking-[0.5em] text-white/20"
        >
          Limited Availability • First Come First Served
        </motion.p>
      </div>

      {/* New Claim Seat Section */}
      <ClaimSeatSection ref={claimSectionRef} onSuccess={onSuccess} />
    </div>
  );
};

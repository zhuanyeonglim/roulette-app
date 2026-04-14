import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Facebook, Send, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Footer } from './Footer';

export const SuccessPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#4a0404] text-white font-sans selection:bg-[#c5a059] selection:text-black flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full py-24 flex flex-col items-center text-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-30"
          >
            <source src="https://assets.cdn.filesafe.space/DfsUTSdZKxCNC7VoSaFx/media/69d752374c6acc8ccbe576d7.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#4a0404] via-transparent to-black/40 z-10" />
        </div>
        
        <div className="relative z-10 container max-w-4xl mx-auto px-4 flex flex-col items-center">
          {/* Logo */}
          <motion.img
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            src="https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/DfsUTSdZKxCNC7VoSaFx/media/69d5e336f0a39cf9a336394e.gif"
            alt="Logo"
            className="w-48 md:w-64 mb-12"
          />

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-5xl lg:text-7xl font-serif-elegant font-bold text-[#c5a059] leading-tight mb-6"
          >
            Your Order Has Been Successfully Submitted.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-base md:text-xl text-white/80 font-sans tracking-wide"
          >
            A Confirmation Email Has Been Sent Successfully To Your Mail Box.
          </motion.p>
        </div>
      </section>

      {/* Before You Go Section */}
      <section className="w-full bg-black py-24 flex flex-col items-center">
        <div className="container max-w-6xl mx-auto px-4 flex flex-col items-center">
          {/* Section Header */}
          <div className="flex items-center gap-4 mb-8 w-full max-w-md">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#c5a059]/50" />
            <span className="text-[#c5a059] font-bold uppercase tracking-[0.3em] text-sm whitespace-nowrap">Before You Go</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#c5a059]/50" />
          </div>

          <h2 className="text-3xl md:text-5xl font-heading font-bold text-center mb-16 leading-tight max-w-3xl text-white">
            Here's A Couple Of Things <br /> To Get You Started Right Away
          </h2>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {/* Card 1: Calendar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center group hover:border-[#c5a059]/50 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Calendar className="h-6 w-6 text-purple-500" />
              </div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-6 rounded-xl mb-6">
                Add To Calendar <br />
                <span className="text-[10px] font-normal opacity-70">Save The Dates</span>
              </Button>
              <div className="space-y-4 text-sm text-white/60 leading-relaxed">
                <p>The training will be delivered in 4 parts over 4 different days.</p>
                <p>We'd love for you to join all of them to get the full experience. But hey, life happens. If you can't make it to every live session, no worries at all—just catch the replays when you can.</p>
                <p>Each session builds on the last, but don't sweat it if you miss one. You'll still be able to jump right in and get tons out of the next one.</p>
              </div>
            </motion.div>

            {/* Card 2: Facebook */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center group hover:border-[#c5a059]/50 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Facebook className="h-6 w-6 text-blue-500" />
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded-xl mb-6">
                Join The Private Group <br />
                <span className="text-[10px] font-normal opacity-70">Request Access</span>
              </Button>
              <div className="space-y-4 text-sm text-white/60 leading-relaxed">
                <p>This is where you can stay connected with the community before the training begins.</p>
                <p>We'll also share useful reminders, updates, and extra support along the way.</p>
                <p>We've got a 70,000 strong community in our little private Facebook Group.</p>
                <p>Don't miss out—this is your go-to spot for extra resources and support.</p>
              </div>
            </motion.div>

            {/* Card 3: Telegram */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center group hover:border-[#c5a059]/50 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-sky-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Send className="h-6 w-6 text-sky-400" />
              </div>
              <Button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-6 rounded-xl mb-6">
                Join The Official Telegram <br />
                <span className="text-[10px] font-normal opacity-70">Get Updates First</span>
              </Button>
              <div className="space-y-4 text-sm text-white/60 leading-relaxed">
                <p>Get Latest Updates You Don't Wanna Miss</p>
                <p>We've saved the best for last. Join the dedicated telegram channel for this training. You'll receive the latest announcements, special links and updates.</p>
              </div>
            </motion.div>

            {/* Card 4: Tong Shu */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center group hover:border-[#c5a059]/50 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="h-6 w-6 text-amber-500" />
              </div>
              
              <div className="relative w-full aspect-square mb-6 rounded-xl overflow-hidden">
                <img 
                  src="https://picsum.photos/seed/tongshu/400/400" 
                  alt="Tong Shu" 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              <h3 className="text-lg font-bold mb-4">Before the training begins</h3>
              
              <div className="space-y-4 text-sm text-white/60 leading-relaxed">
                <p>Prepare your very own <span className="text-[#c5a059] font-bold italic">Tong Shu</span> (Chinese Almanac).</p>
                <p>This will be used during the sessions to check Day Officers and follow the Date Selection examples. Any version is suitable.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

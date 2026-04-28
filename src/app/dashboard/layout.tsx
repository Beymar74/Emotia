"use client";
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import Topbar from './components/layout/Topbar';
import Footer from './components/layout/Footer';
import ProfileModal from './components/modals/ProfileModal';
import AIAdvisorChat from './components/ai/AIAdvisorChat';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [showProfile, setShowProfile] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5E6D0]/30 font-sans text-[#000000] flex flex-col relative">
      <Topbar onOpenProfile={() => setShowProfile(true)} />
      <div className="flex-grow">{children}</div>
      <Footer />

      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
      {showAIChat && (
        <AIAdvisorChat
          onClose={() => setShowAIChat(false)}
          onOpenProduct={() => {}}
        />
      )}

      {!showAIChat && (
        <button
          onClick={() => setShowAIChat(true)}
          className="fixed bottom-8 right-8 bg-[#8E1B3A] text-[#FFFFFF] p-4 rounded-full shadow-2xl hover:bg-[#5A0F24] hover:scale-110 transition-all flex items-center justify-center group z-[40] border border-[#F5E6D0]/20"
        >
          <Sparkles className="w-7 h-7" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out pl-0 group-hover:pl-3 font-bold">
            Asesor IA
          </span>
        </button>
      )}
    </div>
  );
}

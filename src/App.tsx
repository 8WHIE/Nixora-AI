import React, { useState, useEffect } from 'react';
import {
  NavigationTab,
  ViewMode,
  AppSettings,
  UserProfile,
  ProgrammingLanguage,
} from './types';
import { AndroidStatusBar } from './components/layout/AndroidStatusBar';
import { AndroidNavigationBar } from './components/layout/AndroidNavigationBar';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { SplashScreen } from './components/splash/SplashScreen';
import { ChatInterface } from './components/chat/ChatInterface';
import { CodeStudio } from './components/codestudio/CodeStudio';
import { LiveSandbox } from './components/sandbox/LiveSandbox';
import { AndroidApkHub } from './components/apkhub/AndroidApkHub';
import { SettingsModal } from './components/settings/SettingsModal';
import { AuthModal } from './components/auth/AuthModal';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<NavigationTab>('chat');
  const [viewMode, setViewMode] = useState<ViewMode>('phone');

  // Code state passed across tools
  const [studioCode, setStudioCode] = useState<string>('');
  const [studioLanguage, setStudioLanguage] = useState<ProgrammingLanguage>('kotlin');
  const [sandboxCode, setSandboxCode] = useState<string>('');

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // App Settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('nexora_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      model: 'gemini-3.8-flash',
      temperature: 0.7,
      persona: 'architect',
      theme: 'futuristic-dark',
      language: 'en',
      speechVoice: 'default',
      speechRate: 1.0,
      speechPitch: 1.0,
      autoSpeakResponse: false,
      hapticFeedback: true,
    };
  });

  // User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('nexora_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      id: 'usr_dev_1',
      name: 'Nexora Engineer',
      email: 'engineer@nexora.ai',
      role: 'Lead Android & AI Developer',
      avatar: 'N',
      isGuest: false,
      stats: {
        promptsCount: 48,
        codeSnippetsCount: 32,
        projectsExported: 7,
        streakDays: 5,
      },
      badges: ['Android APK Builder', 'Gemini 3.8 Flash Explorer'],
    };
  });

  // Save settings
  useEffect(() => {
    localStorage.setItem('nexora_settings', JSON.stringify(settings));
  }, [settings]);

  // Save user profile
  useEffect(() => {
    localStorage.setItem('nexora_user', JSON.stringify(user));
  }, [user]);

  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleUpdateUser = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  // Navigations between tools
  const handleSendToStudio = (code: string, language: string) => {
    setStudioCode(code);
    setStudioLanguage((language.toLowerCase() as ProgrammingLanguage) || 'kotlin');
    setActiveTab('codestudio');
  };

  const handleSendToSandbox = (code: string) => {
    setSandboxCode(code);
    setActiveTab('sandbox');
  };

  const handleNewChat = () => {
    setActiveTab('chat');
  };

  const handleTabSelect = (tab: NavigationTab) => {
    if (tab === 'settings') {
      setIsSettingsOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#02050e] text-slate-100 flex items-center justify-center relative overflow-hidden font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[140px] pointer-events-none" />

      {/* Animated Splash Screen */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Main Container / Android Device Mockup Frame */}
      <div
        {/* Main Container / Android Device Mockup Frame */}
<div>
  {/* Container (Main Wrapper) */}
  <div className="w-full h-screen flex flex-col transition-all duration-300 relative bg-[#030712]">
    {/* Android Status Bar (Always on mobile mockup or fullscreen) */}
    <AndroidStatusBar />
        {/* Nexora Header */}
        <Header
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onOpenProfile={() => setIsProfileOpen(true)}
          onNewChat={handleNewChat}
          activeModelName={settings.model}
          user={user}
        />

        {/* Viewport Content based on Active Tab */}
        <main className="flex-1 overflow-hidden relative flex flex-col">
          {activeTab === 'chat' && (
            <ChatInterface
              settings={settings}
              onSendToStudio={handleSendToStudio}
              onSendToSandbox={handleSendToSandbox}
            />
          )}

          {activeTab === 'codestudio' && (
            <CodeStudio
              initialCode={studioCode}
              initialLanguage={studioLanguage}
              onSendToSandbox={handleSendToSandbox}
            />
          )}

          {activeTab === 'sandbox' && (
            <LiveSandbox
              initialCode={sandboxCode}
              onExportToAndroidProject={() => setActiveTab('apkhub')}
            />
          )}

          {activeTab === 'apkhub' && <AndroidApkHub />}
        </main>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} onTabChange={handleTabSelect} />

        {/* Android Gesture Bar */}
        <AndroidNavigationBar onHome={() => setActiveTab('chat')} />
      </div>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      <AuthModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onUpdateUser={handleUpdateUser}
      />
    </div>
  );
}

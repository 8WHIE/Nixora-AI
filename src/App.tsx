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
  // --------------------------------------------------
  // Splash Screen
  // --------------------------------------------------
  const [showSplash, setShowSplash] = useState(true);

  // --------------------------------------------------
  // Navigation
  // --------------------------------------------------
  const [activeTab, setActiveTab] =
    useState<NavigationTab>('chat');

  const [viewMode, setViewMode] =
    useState<ViewMode>('phone');

  // --------------------------------------------------
  // Code shared between Chat / Code Studio / Sandbox
  // --------------------------------------------------
  const [studioCode, setStudioCode] = useState<string>('');
  const [studioLanguage, setStudioLanguage] =
    useState<ProgrammingLanguage>('kotlin');

  const [sandboxCode, setSandboxCode] =
    useState<string>('');

  // --------------------------------------------------
  // Modals
  // --------------------------------------------------
  const [isSettingsOpen, setIsSettingsOpen] =
    useState(false);

  const [isProfileOpen, setIsProfileOpen] =
    useState(false);

  // --------------------------------------------------
  // App Settings
  // --------------------------------------------------
  const [settings, setSettings] =
    useState<AppSettings>(() => {
      const saved =
        localStorage.getItem('nixora_settings');

      if (saved) {
        try {
          return JSON.parse(saved) as AppSettings;
        } catch {
          // Use default settings below
        }
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

  // --------------------------------------------------
  // User Profile
  // --------------------------------------------------
  const [user, setUser] =
    useState<UserProfile>(() => {
      const saved =
        localStorage.getItem('nixora_user');

      if (saved) {
        try {
          return JSON.parse(saved) as UserProfile;
        } catch {
          // Use default user below
        }
      }

      return {
        id: 'usr_dev_1',
        name: 'Nixora Engineer',
        email: 'engineer@nixora.ai',
        role: 'Lead Android & AI Developer',
        avatar: 'N',
        isGuest: false,
        stats: {
          promptsCount: 48,
          codeSnippetsCount: 32,
          projectsExported: 7,
          streakDays: 5,
        },
        badges: [
          'Android APK Builder',
          'Gemini 3.8 Flash Explorer',
        ],
      };
    });

  // --------------------------------------------------
  // Persist Settings
  // --------------------------------------------------
  useEffect(() => {
    localStorage.setItem(
      'nixora_settings',
      JSON.stringify(settings)
    );
  }, [settings]);

  // --------------------------------------------------
  // Persist User
  // --------------------------------------------------
  useEffect(() => {
    localStorage.setItem(
      'nixora_user',
      JSON.stringify(user)
    );
  }, [user]);

  // --------------------------------------------------
  // Update Settings
  // --------------------------------------------------
  const handleUpdateSettings = (
    newSettings: Partial<AppSettings>
  ) => {
    setSettings((previous) => ({
      ...previous,
      ...newSettings,
    }));
  };

  // --------------------------------------------------
  // Update User
  // --------------------------------------------------
  const handleUpdateUser = (
    updated: Partial<UserProfile>
  ) => {
    setUser((previous) => ({
      ...previous,
      ...updated,
    }));
  };

  // --------------------------------------------------
  // Send Code To Code Studio
  // --------------------------------------------------
  const handleSendToStudio = (
    code: string,
    language: string
  ) => {
    setStudioCode(code);

    setStudioLanguage(
      language.toLowerCase() as ProgrammingLanguage
    );

    setActiveTab('codestudio');
  };

  // --------------------------------------------------
  // Send Code To Sandbox
  // --------------------------------------------------
  const handleSendToSandbox = (code: string) => {
    setSandboxCode(code);
    setActiveTab('sandbox');
  };

  // --------------------------------------------------
  // New Chat
  // --------------------------------------------------
  const handleNewChat = () => {
    setActiveTab('chat');
  };

  // --------------------------------------------------
  // Navigation Tab Selection
  // --------------------------------------------------
  const handleTabSelect = (
    tab: NavigationTab
  ) => {
    if (tab === 'settings') {
      setIsSettingsOpen(true);
      return;
    }

    setActiveTab(tab);
  };

  // --------------------------------------------------
  // App UI
  // --------------------------------------------------
  return (
    <div className="min-h-screen w-full bg-[#02050e] text-slate-100 flex items-center justify-center relative overflow-hidden font-sans selection:bg-purple-500/30 selection:text-purple-200">

      {/* ==================================================
          Background Ambient Lighting
          ================================================== */}

      <div
        className="
          fixed
          top-0
          left-1/4
          w-[500px]
          h-[500px]
          rounded-full
          bg-cyan-600/10
          blur-[120px]
          pointer-events-none
        "
      />

      <div
        className="
          fixed
          bottom-0
          right-1/4
          w-[600px]
          h-[600px]
          rounded-full
          bg-purple-600/10
          blur-[140px]
          pointer-events-none
        "
      />

      {/* ==================================================
          Animated Splash Screen
          ================================================== */}

      {showSplash && (
        <SplashScreen
          onFinish={() => setShowSplash(false)}
        />
      )}

      {/* ==================================================
          Main Android Device / App Container
          ================================================== */}

      <div className="w-full h-screen flex flex-col transition-all duration-300 relative bg-[#030712]">

        {/* Android Status Bar */}
        <AndroidStatusBar />

        {/* ==================================================
            Nixora Header
            ================================================== */}

        <Header
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onOpenProfile={() => setIsProfileOpen(true)}
          onNewChat={handleNewChat}
          activeModelName={settings.model}
          user={user}
        />

        {/* ==================================================
            Main Viewport
            ================================================== */}

        <main className="flex-1 overflow-hidden relative flex flex-col">

          {/* ---------------- Chat ---------------- */}

          {activeTab === 'chat' && (
            <ChatInterface
              settings={settings}
              onSendToStudio={handleSendToStudio}
              onSendToSandbox={handleSendToSandbox}
            />
          )}

          {/* ---------------- Code Studio ---------------- */}

          {activeTab === 'codestudio' && (
            <CodeStudio
              initialCode={studioCode}
              initialLanguage={studioLanguage}
              onSendToSandbox={handleSendToSandbox}
            />
          )}

          {/* ---------------- Live Sandbox ---------------- */}

          {activeTab === 'sandbox' && (
            <LiveSandbox
              initialCode={sandboxCode}
              onExportToAndroidProject={() =>
                setActiveTab('apkhub')
              }
            />
          )}

          {/* ---------------- APK Hub ---------------- */}

          {activeTab === 'apkhub' && (
            <AndroidApkHub />
          )}

        </main>

        {/* ==================================================
            Bottom Navigation
            ================================================== */}

        <BottomNav
          activeTab={activeTab}
          onTabChange={handleTabSelect}
        />

        {/* ==================================================
            Android Navigation / Gesture Bar
            ================================================== */}

        <AndroidNavigationBar
          onHome={() => setActiveTab('chat')}
        />

      </div>

      {/* ==================================================
          Settings Modal
          ================================================== */}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* ==================================================
          Profile / Authentication Modal
          ================================================== */}

      <AuthModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onUpdateUser={handleUpdateUser}
      />

    </div>
  );
}

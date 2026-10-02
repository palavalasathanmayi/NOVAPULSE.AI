import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/Toast';
import { JudgeDemoTour } from './components/JudgeDemoTour';
import { BusinessImpactModal } from './components/BusinessImpactModal';
import { AuthModal } from './components/AuthModal';
import { DatabaseUsersModal } from './components/DatabaseUsersModal';
import { TestRunnerModal } from './components/TestRunnerModal';
import { ErrorBoundary } from './components/ErrorBoundary';

import { CommandCenter } from './pages/CommandCenter';
import { CustomerRescue } from './pages/CustomerRescue';
import { RootCauseExplorer } from './pages/RootCauseExplorer';
import { StoreIntelligence } from './pages/StoreIntelligence';
import { OperationsCommand } from './pages/OperationsCommand';
import { AiInsights } from './pages/AiInsights';
import { ScenarioSimulator } from './pages/ScenarioSimulator';

const MainLayout: React.FC = () => {
  const {
    activePage,
    setActivePage,
    isBusinessImpactModalOpen,
    setIsBusinessImpactModalOpen,
    isTestRunnerModalOpen,
    setIsTestRunnerModalOpen,
  } = useApp();

  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    isDatabaseUsersModalOpen,
    setIsDatabaseUsersModalOpen,
  } = useAuth();

  // Accessibility & Keyboard Navigation (WCAG AA Compliance)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC closes any open modal
      if (e.key === 'Escape') {
        if (isTestRunnerModalOpen) setIsTestRunnerModalOpen(false);
        if (isBusinessImpactModalOpen) setIsBusinessImpactModalOpen(false);
        if (isAuthModalOpen) setIsAuthModalOpen(false);
        if (isDatabaseUsersModalOpen) setIsDatabaseUsersModalOpen(false);
      }

      // Alt+1 to Alt+7 for quick accessible navigation between core modules
      if (e.altKey) {
        if (e.key === '1') setActivePage('command_center');
        if (e.key === '2') setActivePage('customer_rescue');
        if (e.key === '3') setActivePage('root_causes');
        if (e.key === '4') setActivePage('store_intelligence');
        if (e.key === '5') setActivePage('operations');
        if (e.key === '6') setActivePage('ai_insights');
        if (e.key === '7') setActivePage('scenario_simulator');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isTestRunnerModalOpen,
    isBusinessImpactModalOpen,
    isAuthModalOpen,
    isDatabaseUsersModalOpen,
    setIsTestRunnerModalOpen,
    setIsBusinessImpactModalOpen,
    setIsAuthModalOpen,
    setIsDatabaseUsersModalOpen,
    setActivePage,
  ]);

  return (
    <div
      role="application"
      aria-label="NOVA PULSE Retention Command Center"
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200"
    >
      {/* Top Navigation Landmark */}
      <Navbar />

      {/* Main Body with Sidebar & Content Landmarks */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Landmark */}
        <Sidebar />

        {/* Primary Main Content Landmark */}
        <main
          role="main"
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto bg-slate-950 focus:outline-none"
        >
          {activePage === 'command_center' && <CommandCenter />}
          {activePage === 'customer_rescue' && <CustomerRescue />}
          {activePage === 'root_causes' && <RootCauseExplorer />}
          {activePage === 'store_intelligence' && <StoreIntelligence />}
          {activePage === 'operations' && <OperationsCommand />}
          {activePage === 'ai_insights' && <AiInsights />}
          {activePage === 'scenario_simulator' && <ScenarioSimulator />}
        </main>
      </div>

      {/* Guided Judge Tour Overlay */}
      <JudgeDemoTour />

      {/* Business Impact & Budget Modal */}
      <BusinessImpactModal />

      {/* Google Login & Authentication Modal */}
      <AuthModal />

      {/* Database Users Registry Modal */}
      <DatabaseUsersModal />

      {/* Automated Test Suite & Code Quality Evaluation Modal */}
      <TestRunnerModal
        isOpen={isTestRunnerModalOpen}
        onClose={() => setIsTestRunnerModalOpen(false)}
      />

      {/* Toast Notification Container with polite screen-reader announcements */}
      <div aria-live="polite" aria-atomic="true">
        <ToastContainer />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <MainLayout />
        </AppProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/Toast';
import { JudgeDemoTour } from './components/JudgeDemoTour';
import { BusinessImpactModal } from './components/BusinessImpactModal';
import { AuthModal } from './components/AuthModal';
import { DatabaseUsersModal } from './components/DatabaseUsersModal';

import { CommandCenter } from './pages/CommandCenter';
import { CustomerRescue } from './pages/CustomerRescue';
import { RootCauseExplorer } from './pages/RootCauseExplorer';
import { StoreIntelligence } from './pages/StoreIntelligence';
import { OperationsCommand } from './pages/OperationsCommand';
import { AiInsights } from './pages/AiInsights';
import { ScenarioSimulator } from './pages/ScenarioSimulator';

const MainLayout: React.FC = () => {
  const { activePage } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Body with Sidebar & Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Dynamic Page Router */}
        <main className="flex-1 overflow-y-auto bg-slate-950">
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

      {/* Database Users Registry Modal ("Remember every user in database") */}
      <DatabaseUsersModal />

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </AuthProvider>
  );
}

import React, { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import HomeScreen from './components/HomeScreen';
import DiseaseDetector from './components/DiseaseDetector';
import WeatherDashboard from './components/WeatherDashboard';
import Chatbot from './components/Chatbot';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import AuthScreen from './components/AuthScreen';
import LoadingSpinner from './components/LoadingSpinner';
import { Page } from './types';
import { onAuthStateChanged, handleSignOut } from './services/authService';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setIsLoadingAuth(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomeScreen onNavigate={setCurrentPage} />;
      case 'detect':
        return <DiseaseDetector user={user!} />;
      case 'weather':
        return <WeatherDashboard />;
      case 'chatbot':
        return <Chatbot />;
      case 'dashboard':
        return <AnalyticsDashboard />;
      default:
        return <HomeScreen onNavigate={setCurrentPage} />;
    }
  };

  if (isLoadingAuth) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <LanguageProvider>
      <div className="bg-brand-light min-h-screen font-sans text-gray-800">
        <Header 
          user={user}
          onSignOut={handleSignOut}
          currentPage={currentPage} 
          onNavigate={setCurrentPage} 
        />
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {renderPage()}
        </main>
        <footer className="text-center p-4 text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Uzhavan Tech. Empowering Farmers with AI.</p>
        </footer>
      </div>
    </LanguageProvider>
  );
};

export default App;
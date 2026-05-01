import React, { useState, useRef, useEffect } from 'react';
import { Page } from '../types';
import { NAV_ITEMS } from '../constants';
import type { User } from 'firebase/auth';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '@/hooks/useTranslation';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  user: User;
  onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, user, onSignOut }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
                <span className="text-2xl font-bold text-brand-green">🌾 Uzhavan Tech</span>
            </div>
            <nav className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${
                      currentPage === item.id
                        ? 'bg-brand-green text-white'
                        : 'text-gray-600 hover:bg-green-100 hover:text-brand-green-dark'
                    }`}
                  >
                    <item.icon className="inline-block w-5 h-5 mr-2" />
                    {t(`nav.${item.id}`)}
                  </button>
                ))}
              </div>
            </nav>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 gap-4">
              <LanguageSelector />
                <div className="ml-3 relative" ref={userMenuRef}>
                    <div>
                        <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="max-w-xs bg-gray-100 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green" id="user-menu" aria-haspopup="true">
                            <span className="sr-only">Open user menu</span>
                            <div className="w-8 h-8 rounded-full bg-brand-green text-white flex items-center justify-center font-bold">
                                {user.email?.charAt(0).toUpperCase()}
                            </div>
                        </button>
                    </div>
                    {isUserMenuOpen && (
                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                            <div className="px-4 py-2 text-sm text-gray-700 border-b">{user.email}</div>
                            <button onClick={onSignOut} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Logout</button>
                        </div>
                    )}
                </div>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-green-100 inline-flex items-center justify-center p-2 rounded-md text-brand-green hover:text-white hover:bg-brand-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                 <svg className="h-6 w-6" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                 </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  currentPage === item.id
                    ? 'bg-brand-green text-white'
                    : 'text-gray-600 hover:bg-green-100 hover:text-brand-green-dark'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="px-5 py-2 border-b border-gray-200">
                  <LanguageSelector />
                </div>
                <div className="flex items-center px-5 mt-3">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-brand-green text-white flex items-center justify-center font-bold">
                            {user.email?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <div className="ml-3">
                        <div className="text-base font-medium leading-none text-gray-800">{user.displayName || user.email?.split('@')[0]}</div>
                        <div className="text-sm font-medium leading-none text-gray-500">{user.email}</div>
                    </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                    <button onClick={onSignOut} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-brand-green-dark hover:bg-green-100">
                        Logout
                    </button>
                </div>
            </div>
        </div>
      )}
    </header>
  );
};

export default Header;

import React from 'react';
import { Page } from '../types';
import { LeafIcon } from '../constants';
import { useTranslation } from '@/hooks/useTranslation';

interface HomeScreenProps {
  onNavigate: (page: Page) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  return (
    <div className="text-center py-12 md:py-24">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold text-brand-green-dark mb-4">
          {t('home.title')}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {t('home.subtitle')}
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => onNavigate('detect')}
            className="flex items-center justify-center bg-brand-green text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:bg-brand-green-dark transition-transform transform hover:scale-105 duration-300 ease-in-out"
          >
            <LeafIcon className="w-6 h-6 mr-3" />
            {t('home.detectButton')}
          </button>
        </div>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <FeatureCard 
            title="home.feature1.title" 
            description="home.feature1.description"
            icon="📸"
        />
        <FeatureCard 
            title="home.feature2.title"
            description="home.feature2.description"
            icon="🌍"
        />
        <FeatureCard 
            title="home.feature3.title"
            description="home.feature3.description"
            icon="📈"
        />
      </div>
    </div>
  );
};

interface FeatureCardProps {
    title: string;
    description: string;
    icon: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
    const { t } = useTranslation();
    return (
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-xl font-bold text-brand-green-dark mb-2">{t(title)}</h3>
            <p className="text-gray-600">{t(description)}</p>
        </div>
    );
};


export default HomeScreen;


import React from 'react';
import { AppTab } from '../types';

interface TabNavigationProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: AppTab.Home, icon: '🏠', label: 'Home' },
    { id: AppTab.Billing, icon: '📄', label: 'Bill' },
    { id: AppTab.Customers, icon: '👥', label: 'Khata' },
    { id: AppTab.Inventory, icon: '📦', label: 'Stock' },
    { id: AppTab.BabuRao, icon: '🤖', label: 'Babu Rao' },
    { id: AppTab.Settings, icon: '⚙️', label: 'Setup' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-pink-100 flex justify-around items-center py-2 px-1 safe-bottom shadow-[0_-4px_10px_rgba(255,105,180,0.1)] z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center flex-1 py-1 transition-all ${
            activeTab === tab.id ? 'text-pink-600' : 'text-gray-400'
          }`}
        >
          <span className="text-2xl mb-1">{tab.icon}</span>
          <span className="text-[10px] font-bold uppercase">{tab.label}</span>
          {activeTab === tab.id && (
            <div className="w-1 h-1 bg-pink-600 rounded-full mt-1"></div>
          )}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;

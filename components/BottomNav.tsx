
import React from 'react';
import { View } from '../types';
import { CameraIcon } from './icons/CameraIcon';
import { CompassIcon } from './icons/CompassIcon';

interface BottomNavProps {
  currentView: View;
  setView: (view: View) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors ${isActive ? 'text-amber-600' : 'text-stone-500 hover:text-stone-800'}`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView }) => {
  return (
    <nav className="w-full bg-white border-t border-stone-200 flex justify-around h-16 shadow-t-lg sticky bottom-0 z-30">
      <NavItem 
        label="Scan"
        icon={<CameraIcon className="w-6 h-6 mb-1" />}
        isActive={currentView === 'scanner' || currentView === 'detail'}
        onClick={() => setView('scanner')}
      />
      <NavItem 
        label="Tours"
        icon={<CompassIcon className="w-6 h-6 mb-1" />}
        isActive={currentView === 'tours'}
        onClick={() => setView('tours')}
      />
    </nav>
  );
};

export default BottomNav;

import React from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuthStore } from '../../features/auth/store/authStore';
import { useProfileStore } from '../../features/auth/store/profileStore';

export function UserMenu() {
  const { signOut } = useAuthStore();
  const { profile } = useProfileStore();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

return (
  <div className="flex items-center gap-4">
    <div className="flex items-center gap-2">
      <User className="w-5 h-5 text-gray-500" />
      <span className="text-sm text-gray-700">
        Welcome, {profile?.username 
          ? profile.username.split(' ')[0].charAt(0).toUpperCase() + profile.username.split(' ')[0].slice(1) 
          : 'User'}
      </span>
    </div>
    <button
      onClick={handleSignOut}
      className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <LogOut className="w-4 h-4" />
      Sign Out
    </button>
  </div>
);


}
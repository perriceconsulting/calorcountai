import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Camera, Calendar, Trophy, Users, Menu, X } from 'lucide-react';
import { UserMenu } from './UserMenu';
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities';

export function Navbar() {
  const location = useLocation();
  const { isMobile } = useDeviceCapabilities();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <nav className="bg-white shadow-lg relative z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Camera className="h-6 w-6 text-blue-600" />
              <span className="ml-2 font-semibold">AI Food Tracker</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-8">
              <NavLink to="/" active={location.pathname === "/"}>
                Track Food
              </NavLink>
              <NavLink to="/calendar" active={location.pathname === "/calendar"}>
                <Calendar className="w-5 h-5 mr-1" />
                Calendar
              </NavLink>
              <NavLink to="/community" active={location.pathname === "/community"}>
                <Users className="w-5 h-5 mr-1" />
                Community
              </NavLink>
              <NavLink to="/achievements" active={location.pathname === "/achievements"}>
                <Trophy className="w-5 h-5 mr-1" />
                Achievements
              </NavLink>
              <UserMenu />
            </div>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobile && isMenuOpen && (
        <div className="fixed inset-0 top-16 bg-white z-40">
          <div className="flex flex-col p-4 space-y-4">
            <MobileNavLink 
              to="/" 
              active={location.pathname === "/"} 
              onClick={() => setIsMenuOpen(false)}
            >
              <Camera className="w-5 h-5 mr-2" />
              Track Food
            </MobileNavLink>
            <MobileNavLink 
              to="/calendar" 
              active={location.pathname === "/calendar"}
              onClick={() => setIsMenuOpen(false)}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Calendar
            </MobileNavLink>
            <MobileNavLink 
              to="/community" 
              active={location.pathname === "/community"}
              onClick={() => setIsMenuOpen(false)}
            >
              <Users className="w-5 h-5 mr-2" />
              Community
            </MobileNavLink>
            <MobileNavLink 
              to="/achievements" 
              active={location.pathname === "/achievements"}
              onClick={() => setIsMenuOpen(false)}
            >
              <Trophy className="w-5 h-5 mr-2" />
              Achievements
            </MobileNavLink>
            <div className="pt-4 border-t">
              <UserMenu />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
}

function NavLink({ to, active, children }: NavLinkProps) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
        active
          ? "border-blue-600 text-gray-900"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      }`}
    >
      {children}
    </Link>
  );
}

interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void;
}

function MobileNavLink({ to, active, children, onClick }: MobileNavLinkProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center p-3 rounded-lg ${
        active
          ? "bg-blue-50 text-blue-600"
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      {children}
    </Link>
  );
}
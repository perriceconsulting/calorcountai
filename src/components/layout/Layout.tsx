import { Outlet } from 'react-router-dom';
import { Navbar } from '../navigation/Navbar';
import { ToastContainer } from '../feedback/Toast';
import { SupabaseTest } from '../shared/SupabaseTest';

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <ToastContainer />
      {process.env.NODE_ENV === 'development' && <SupabaseTest />}
    </div>
  );
}
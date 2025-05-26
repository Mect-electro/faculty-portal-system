import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, LogOut, User } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Faculty Portal</span>
            </div>
            
            {user && (
              <div className="flex items-center">
                <div className="mr-4 text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user.email}</p>
                  {profile && (
                    <p className="text-xs text-gray-500">Role: {profile.role}</p>
                  )}
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                      <User className="h-4 w-4" />
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSignOut}
                    className="ml-3 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    title="Sign out"
                  >
                    <LogOut className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="py-6">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
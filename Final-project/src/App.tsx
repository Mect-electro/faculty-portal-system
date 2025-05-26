import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import BranchSelectPage from './pages/BranchSelectPage';
import ClassSelectPage from './pages/ClassSelectPage';
import PortalPage from './pages/PortalPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize the app and check for authentication
    const initApp = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
      setIsLoading(false);
    };

    initApp();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate replace to="/branches" />} />
          
          <Route path="/branches" element={
            <ProtectedRoute>
              <BranchSelectPage />
            </ProtectedRoute>
          } />
          
          <Route path="/classes/:branchId" element={
            <ProtectedRoute>
              <ClassSelectPage />
            </ProtectedRoute>
          } />
          
          <Route path="/portal/:classId" element={
            <ProtectedRoute>
              <PortalPage />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
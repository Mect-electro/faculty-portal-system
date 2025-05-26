import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase, Class } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import AppLayout from '../components/AppLayout';
import StudentsTab from '../components/portal/StudentsTab';
import CalendarTab from '../components/portal/CalendarTab';
import DocumentsTab from '../components/portal/DocumentsTab';
import { Book, Calendar, Users } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';

type TabType = 'students' | 'calendar' | 'documents';

const PortalPage = () => {
  const { classId } = useParams<{ classId: string }>();
  const { user, profile } = useAuth();
  const [classInfo, setClassInfo] = useState<Class | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('students');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClassInfo = async () => {
      if (!classId) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('classes')
          .select('*, branches(name)')
          .eq('id', classId)
          .single();
          
        if (error) {
          throw error;
        }
        
        setClassInfo(data);
      } catch (error: any) {
        console.error('Error fetching class info:', error);
        setError(error.message || 'Failed to load class information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassInfo();
  }, [classId]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const isAdminOrFaculty = profile?.role === 'Admin' || profile?.role === 'Faculty';

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {classInfo?.name || 'Class Portal'}
          </h1>
          {classInfo?.branches?.name && (
            <p className="text-gray-500">Branch: {classInfo.branches.name}</p>
          )}
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('students')}
                className={`${
                  activeTab === 'students'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center transition-colors duration-200`}
              >
                <Users className="h-5 w-5 mr-2" />
                Students
              </button>
              
              <button
                onClick={() => setActiveTab('calendar')}
                className={`${
                  activeTab === 'calendar'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center transition-colors duration-200`}
              >
                <Calendar className="h-5 w-5 mr-2" />
                Calendar
              </button>
              
              <button
                onClick={() => setActiveTab('documents')}
                className={`${
                  activeTab === 'documents'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center transition-colors duration-200`}
              >
                <Book className="h-5 w-5 mr-2" />
                Documents
              </button>
            </nav>
          </div>
          
          <div className="p-4 sm:p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                <p>{error}</p>
              </div>
            )}
            
            {activeTab === 'students' && (
              <StudentsTab 
                classId={Number(classId)} 
                isAdminOrFaculty={isAdminOrFaculty} 
              />
            )}
            
            {activeTab === 'calendar' && (
              <CalendarTab 
                classId={Number(classId)} 
                isAdminOrFaculty={isAdminOrFaculty} 
              />
            )}
            
            {activeTab === 'documents' && (
              <DocumentsTab 
                classId={classId || ''} 
                isAdminOrFaculty={isAdminOrFaculty}
                userId={user?.id || ''} 
              />
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default PortalPage;
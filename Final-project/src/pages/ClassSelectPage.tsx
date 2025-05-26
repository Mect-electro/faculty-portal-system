import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase, Class, Branch } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import AppLayout from '../components/AppLayout';
import { ArrowLeft, ChevronRight, Notebook } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';

const ClassSelectPage = () => {
  const navigate = useNavigate();
  const { branchId } = useParams<{ branchId: string }>();
  useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [branch, setBranch] = useState<Branch | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      if (!branchId) return;
      
      try {
        setIsLoading(true);
        
        // Fetch branch details
        const { data: branchData, error: branchError } = await supabase
          .from('branches')
          .select('*')
          .eq('id', branchId)
          .single();
          
        if (branchError) {
          throw branchError;
        }
        
        setBranch(branchData);
        
        // Fetch classes for the branch
        const { data: classesData, error: classesError } = await supabase
          .from('classes')
          .select('*')
          .eq('branch_id', branchId)
          .order('name', { ascending: true });
          
        if (classesError) {
          throw classesError;
        }
        
        setClasses(classesData || []);
      } catch (error: any) {
        console.error('Error fetching classes:', error);
        setError(error.message || 'Failed to load classes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasses();
  }, [branchId]);

  const handleBack = () => {
    navigate('/branches');
  };

  const handleContinue = () => {
    if (selectedClassId) {
      navigate(`/portal/${selectedClassId}`);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-indigo-600 p-6">
            <h1 className="text-2xl font-bold text-white">Select Class</h1>
            <p className="text-indigo-200">
              {branch ? `Branch: ${branch.name}` : 'Choose a class to continue'}
            </p>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                <p>{error}</p>
              </div>
            )}

            {classes.length === 0 && !isLoading && !error ? (
              <div className="text-center py-8">
                <Notebook className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No classes available</h3>
                <p className="mt-1 text-sm text-gray-500">There are no classes for this branch.</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="class">
                    Class
                  </label>
                  <select
                    id="class"
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={selectedClassId || ''}
                    onChange={(e) => setSelectedClassId(Number(e.target.value))}
                  >
                    <option value="">Select a class</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={handleBack}
                    className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Back
                  </button>
                  
                  <button
                    onClick={handleContinue}
                    disabled={!selectedClassId}
                    className={`flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 ${
                      !selectedClassId ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Continue
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ClassSelectPage;
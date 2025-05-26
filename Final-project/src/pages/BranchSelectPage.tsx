import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, Branch } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import AppLayout from '../components/AppLayout';
import { BookOpen, ChevronRight } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';

const BranchSelectPage = () => {
  const navigate = useNavigate();
  useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('branches')
          .select('*')
          .order('name', { ascending: true });

        if (error) {
          throw error;
        }

        setBranches(data || []);
      } catch (error: any) {
        console.error('Error fetching branches:', error);
        setError(error.message || 'Failed to load branches');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const handleContinue = () => {
    if (selectedBranchId) {
      navigate(`/classes/${selectedBranchId}`);
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
            <h1 className="text-2xl font-bold text-white">Select Branch</h1>
            <p className="text-indigo-200">Choose the branch you want to access</p>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                <p>{error}</p>
              </div>
            )}

            {branches.length === 0 && !isLoading && !error ? (
              <div className="text-center py-8">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No branches available</h3>
                <p className="mt-1 text-sm text-gray-500">Contact your administrator to add branches.</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="branch">
                    Branch
                  </label>
                  <select
                    id="branch"
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={selectedBranchId || ''}
                    onChange={(e) => setSelectedBranchId(Number(e.target.value))}
                  >
                    <option value="">Select a branch</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleContinue}
                    disabled={!selectedBranchId}
                    className={`flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 ${
                      !selectedBranchId ? 'opacity-50 cursor-not-allowed' : ''
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

export default BranchSelectPage;
import { Loader2 } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      <h2 className="mt-4 text-xl font-semibold text-gray-800">Loading...</h2>
    </div>
  );
};

export default LoadingScreen;
import { useEffect, useState } from 'react';
import { supabase, Student } from '../../lib/supabase';
import { Plus, Search, Trash2, User } from 'lucide-react';

interface StudentsTabProps {
  classId: number;
  isAdminOrFaculty: boolean;
}

const StudentsTab = ({ classId, isAdminOrFaculty }: StudentsTabProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, [classId]);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('class_id', classId)
        .order('name', { ascending: true });
        
      if (error) {
        throw error;
      }
      
      setStudents(data || []);
    } catch (error: any) {
      console.error('Error fetching students:', error);
      setError(error.message || 'Failed to load students');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newStudentName.trim() || !newStudentEmail.trim()) {
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('students')
        .insert([
          { 
            class_id: classId, 
            name: newStudentName.trim(), 
            email: newStudentEmail.trim() 
          }
        ])
        .select();
        
      if (error) {
        throw error;
      }
      
      setStudents([...students, data[0]]);
      setNewStudentName('');
      setNewStudentEmail('');
      setIsAddingStudent(false);
    } catch (error: any) {
      console.error('Error adding student:', error);
      setError(error.message || 'Failed to add student');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId: number) => {
    if (!confirm('Are you sure you want to delete this student?')) {
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId);
        
      if (error) {
        throw error;
      }
      
      setStudents(students.filter(student => student.id !== studentId));
    } catch (error: any) {
      console.error('Error deleting student:', error);
      setError(error.message || 'Failed to delete student');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStudents = searchTerm 
    ? students.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : students;

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search students..."
            className="pl-10 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {isAdminOrFaculty && (
          <button
            onClick={() => setIsAddingStudent(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Student
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}
      
      {isAddingStudent && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Add New Student</h3>
          <form onSubmit={handleAddStudent}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsAddingStudent(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading && !error ? (
        <div className="py-12 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm 
              ? "No students match your search criteria." 
              : "There are no students in this class yet."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                {isAdminOrFaculty && (
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{student.email}</div>
                  </td>
                  {isAdminOrFaculty && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full p-1"
                        title="Delete student"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentsTab;
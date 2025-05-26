import { useEffect, useState } from 'react';
import { supabase, Document } from '../../lib/supabase';
import { storage } from '../../lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Clock, Download, FileText, Plus, Trash2, Upload } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface DocumentsTabProps {
  classId: string;
  isAdminOrFaculty: boolean;
  userId: string;
}

const DocumentsTab = ({ classId, isAdminOrFaculty, userId }: DocumentsTabProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newDocument, setNewDocument] = useState({
    title: '',
    file: null as File | null,
  });

  useEffect(() => {
    fetchDocuments();
  }, [classId]);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('class_id', classId)
        .order('uploaded_at', { ascending: false });

      if (error) {
        throw error;
      }

      setDocuments(data || []);
    } catch (error: any) {
      console.error('Error fetching documents:', error);
      setError(error.message || 'Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewDocument({
        title: file.name,
        file: file
      });
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newDocument.title.trim() || !newDocument.file) {
      setError('Please provide a title and select a file.');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      // Create a unique file path in Firebase Storage
      const fileExt = newDocument.file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `documents/${classId}/${fileName}`;

      // Upload file to Firebase Storage
      const storageRef = ref(storage, filePath);
      await uploadBytes(storageRef, newDocument.file);

      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);

      // Add document record to Supabase
      const { data: documentData, error: documentError } = await supabase
        .from('documents')
        .insert([{
          class_id: classId,
          title: newDocument.title.trim(),
          file_url: downloadURL,
          uploaded_by: userId,
          file_path: filePath // Store the Firebase path for later deletion
        }])
        .select()
        .single();

      if (documentError) {
        throw documentError;
      }

      setDocuments([documentData, ...documents]);
      setNewDocument({
        title: '',
        file: null
      });

    } catch (error: any) {
      console.error('Error uploading document:', error);
      setError(error.message || 'Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId: number, filePath: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Delete the file from Firebase Storage
      const storageRef = ref(storage, filePath);
      await deleteObject(storageRef);

      // Delete the document record from Supabase
      const { error: deleteError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (deleteError) {
        throw deleteError;
      }

      setDocuments(documents.filter(doc => doc.id !== documentId));
    } catch (error: any) {
      console.error('Error deleting document:', error);
      setError(error.message || 'Failed to delete document');
    } finally {
      setIsLoading(false);
    }
  };

  const formatUploadDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'PPP');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Documents</h2>
        {isAdminOrFaculty && (
          <label 
            htmlFor="fileUpload"
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 cursor-pointer"
          >
            <Plus className="h-5 w-5 mr-2" />
            Upload Document
            <input 
              id="fileUpload" 
              type="file" 
              className="hidden" 
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}
      
      {newDocument.file && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Upload Document</h3>
          <form onSubmit={handleUpload}>
            <div className="mb-4">
              <div className="flex items-center p-2 bg-indigo-50 border border-indigo-100 rounded">
                <FileText className="h-5 w-5 text-indigo-600 mr-2" />
                <span className="text-sm text-gray-700 truncate">{newDocument.file.name}</span>
                <span className="ml-auto text-xs text-gray-500">
                  {(newDocument.file.size / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                Document Title
              </label>
              <input
                type="text"
                id="title"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newDocument.title}
                onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
                required
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setNewDocument({ title: '', file: null })}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className={`flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 ${
                  isUploading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5 mr-2" />
                    Upload
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading && !error && !isUploading ? (
        <div className="py-12 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No documents found</h3>
          <p className="mt-1 text-sm text-gray-500">
            There are no documents for this class yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((document) => (
            <div key={document.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-indigo-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">{document.title}</h3>
                </div>
                <div className="flex">
                  <a
                    href={document.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="text-indigo-600 hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-1 mr-2"
                    title="Download document"
                  >
                    <Download className="h-5 w-5" />
                  </a>
                  
                  {isAdminOrFaculty && (
                    <button
                      onClick={() => handleDeleteDocument(document.id, document.file_path)}
                      className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full p-1"
                      title="Delete document"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>Uploaded on {formatUploadDate(document.uploaded_at)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentsTab;
import { useEffect, useState } from 'react';
import { supabase, Event } from '../../lib/supabase';
import { Calendar as CalendarIcon, Clock, Plus, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface CalendarTabProps {
  classId: number;
  isAdminOrFaculty: boolean;
}

const CalendarTab = ({ classId, isAdminOrFaculty }: CalendarTabProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start_time: '',
    end_time: '',
    description: '',
  });

  useEffect(() => {
    fetchEvents();
  }, [classId]);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('class_id', classId)
        .order('start_time', { ascending: true });
        
      if (error) {
        throw error;
      }
      
      setEvents(data || []);
    } catch (error: any) {
      console.error('Error fetching events:', error);
      setError(error.message || 'Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEvent.title.trim() || !newEvent.start_time || !newEvent.end_time) {
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('events')
        .insert([
          { 
            class_id: classId, 
            title: newEvent.title.trim(), 
            start_time: newEvent.start_time,
            end_time: newEvent.end_time,
            description: newEvent.description.trim()
          }
        ])
        .select();
        
      if (error) {
        throw error;
      }
      
      setEvents([...events, data[0]]);
      setNewEvent({
        title: '',
        start_time: '',
        end_time: '',
        description: '',
      });
      setIsAddingEvent(false);
    } catch (error: any) {
      console.error('Error adding event:', error);
      setError(error.message || 'Failed to add event');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);
        
      if (error) {
        throw error;
      }
      
      setEvents(events.filter(event => event.id !== eventId));
    } catch (error: any) {
      console.error('Error deleting event:', error);
      setError(error.message || 'Failed to delete event');
    } finally {
      setIsLoading(false);
    }
  };

  const formatEventDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'PPP');
    } catch (error) {
      return dateString;
    }
  };

  const formatEventTime = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'p');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Upcoming Events</h2>
        
        {isAdminOrFaculty && (
          <button
            onClick={() => setIsAddingEvent(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Event
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}
      
      {isAddingEvent && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Add New Event</h3>
          <form onSubmit={handleAddEvent}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                Title
              </label>
              <input
                type="text"
                id="title"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="start_time">
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  id="start_time"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newEvent.start_time}
                  onChange={(e) => setNewEvent({ ...newEvent, start_time: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="end_time">
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  id="end_time"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newEvent.end_time}
                  onChange={(e) => setNewEvent({ ...newEvent, end_time: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsAddingEvent(false)}
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
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
          <p className="mt-1 text-sm text-gray-500">
            There are no scheduled events for this class.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                {isAdminOrFaculty && (
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full p-1"
                    title="Delete event"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
              
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>{formatEventDate(event.start_time)}</span>
              </div>
              
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>{formatEventTime(event.start_time)} - {formatEventTime(event.end_time)}</span>
              </div>
              
              {event.description && (
                <p className="mt-2 text-sm text-gray-600">{event.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CalendarTab;
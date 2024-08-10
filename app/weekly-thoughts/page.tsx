'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth, useUser } from '@clerk/clerk-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faShare } from '@fortawesome/free-solid-svg-icons';

interface Message {
  _id: string;
  firstname: string;
  lastname: string;
  message: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  likedBy: string[];
}

const WeeklyPage: React.FC = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeeklyMessages = async () => {
      try {
        const response = await axios.get<Message[]>('http://localhost:5000/api/messages/weekly');
        setMessages(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching weekly messages');
        setLoading(false);
      }
    };

    fetchWeeklyMessages();
  }, []);

  const handleLike = async (messageId: string) => {
    if (!user) return;

    try {
      const response = await axios.post(`http://localhost:5000/api/messages/${messageId}/like`, {
        userId: user.id,
      });
      setMessages(messages.map(msg => msg._id === messageId ? response.data : msg));
    } catch (err) {
      console.error('Error liking message');
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Thoughts from the Last 7 Days</h1>
      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg._id} className="flex flex-col bg-white p-4 border rounded-lg shadow-md hover:bg-gray-50 transition duration-150">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {msg.firstname.charAt(0)}
              </div>
              <div className="ml-4 flex-1">
                <p className="text-lg font-semibold text-gray-900">{msg.firstname} {msg.lastname}</p>
                <p className="text-gray-700 mt-1">{msg.message}</p>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <span>Posted at: {new Date(msg.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center mt-4 space-x-4">
                  <button
                    onClick={() => handleLike(msg._id)}
                    className={`flex items-center ${msg.likedBy.includes(user?.id) ? 'text-red-500' : 'text-gray-500'} hover:text-red-700 focus:outline-none`}
                  >
                    <FontAwesomeIcon icon={faHeart} className="h-5 w-5 mr-1" />
                    {msg.likes}
                  </button>
                  <button className="flex items-center text-gray-500 hover:text-gray-700 focus:outline-none">
                    <FontAwesomeIcon icon={faShare} className="h-5 w-5 mr-1" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyPage;

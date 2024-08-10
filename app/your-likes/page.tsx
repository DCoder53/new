'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth, useUser } from '@clerk/clerk-react';

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

const YourLikesPage: React.FC = () => {
  const { user } = useUser();
  const [likedMessages, setLikedMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchLikedMessages = async () => {
      try {
        const response = await axios.get<Message[]>(`http://localhost:5000/api/messages/liked/${user.id}`);
        setLikedMessages(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching liked messages');
        setLoading(false);
      }
    };

    fetchLikedMessages();
  }, [user]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Your Likes</h1>
      <div className="space-y-4">
        {likedMessages.map((msg) => (
          <div key={msg._id} className="flex flex-col bg-white p-4 border rounded-lg shadow-md hover:bg-gray-50 transition duration-150">
            <div className="flex items-start">
              {/* Circular avatar with the first letter of the first name */}
              <div className="flex-shrink-0 w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {msg.firstname.charAt(0)}
              </div>
              <div className="ml-4 flex-1">
                <p className="text-lg font-semibold text-gray-900">{msg.firstname} {msg.lastname}</p>
                <p className="text-gray-700 mt-1">{msg.message}</p>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <span>Posted at: {new Date(msg.createdAt).toLocaleString()}</span>
                </div>
                {/* Like Count */}
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <span>{msg.likes} {msg.likes === 1 ? 'Like' : 'Likes'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourLikesPage;

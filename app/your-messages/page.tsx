'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

interface Message {
  _id: string;
  firstname: string;
  lastname: string;
  message: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const YourMessages: React.FC = () => {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editMessageText, setEditMessageText] = useState<string>('');

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user) return;

      try {
        const response = await axios.get<Message[]>(`http://localhost:5000/api/messages/${user.id}`);
        setMessages(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching messages');
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user]);

  const handleDelete = async (messageId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/messages/${messageId}`);
      setMessages(messages.filter(msg => msg._id !== messageId));
    } catch (err) {
      setError('Error deleting message');
    }
  };

  const handleEdit = (messageId: string, currentMessage: string) => {
    setEditingMessageId(messageId);
    setEditMessageText(currentMessage);
  };

  const handleUpdate = async () => {
    if (!editingMessageId) return;

    try {
      await axios.put(`http://localhost:5000/api/messages/${editingMessageId}`, {
        message: editMessageText,
      });
      setMessages(messages.map(msg => 
        msg._id === editingMessageId ? { ...msg, message: editMessageText } : msg
      ));
      setEditingMessageId(null);
      setEditMessageText('');
    } catch (err) {
      setError('Error updating message');
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Your Messages</h1>
      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg._id} className="flex items-start bg-white p-4 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition duration-150">
            {/* Profile Picture */}
            <div className="flex-shrink-0 w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
              {msg.firstname.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <p className="font-semibold text-gray-800 mr-2">{msg.firstname} {msg.lastname}</p>
                <p className="text-gray-500 text-sm">{new Date(msg.createdAt).toLocaleString()}</p>
              </div>
              {editingMessageId === msg._id ? (
                <div>
                  <textarea
                    value={editMessageText}
                    onChange={(e) => setEditMessageText(e.target.value)}
                    className="w-full p-2 mb-2 border border-gray-300 rounded"
                  />
                  <button
                    onClick={handleUpdate}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => setEditingMessageId(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-gray-800 mb-2">{msg.message}</p>
                  <div className="flex items-center text-gray-600 text-sm space-x-4">
                    <button onClick={() => handleEdit(msg._id, msg.message)} className="flex items-center hover:text-blue-500">
                      <FontAwesomeIcon icon={faEdit} className="h-4 w-4 mr-1" />
                      <span>Edit</span>
                    </button>
                    <button onClick={() => handleDelete(msg._id)} className="flex items-center hover:text-red-500">
                      <FontAwesomeIcon icon={faTrash} className="h-4 w-4 mr-1" />
                      <span>Delete</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourMessages;

"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';

const Sendbox = () => {
  const { user } = useUser();
  const [message, setMessage] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Automatically set firstname and lastname from Clerk user profile
  const firstname = user?.firstName || 'Guest';
  const lastname = user?.lastName || 'Guest';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const userId = user.id;

    try {
      const response = await axios.post('http://localhost:5000/api/messages', {
        firstname,
        lastname,
        message,
        userId,
      });
      setNotification('Message sent successfully!');
      setMessage('');
    } catch (error) {
      setNotification('Error sending message');
      console.error('Error sending message:', error);
    }
  };

  const closeNotification = () => setNotification(null);

  return (
    <div className="flex justify-center min-h-screen">
      <div className="w-full max-w-md">
        <form className="border-none p-4" onSubmit={handleSubmit} data-aos="fade-down">
          <textarea
            name="message"
            cols={30}
            rows={4}
            placeholder="Type your thoughts here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="text-background w-full p-2 mb-4 border border-gray-300 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-primary bg-gray-300 hover:shadow-lg hover:opacity-90 text-background font-bold py-2 px-4 rounded"
          >
            Send
          </button>
        </form>
        {notification && (
          <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center space-x-2">
            <span>{notification}</span>
            <button onClick={closeNotification} className="ml-auto text-lg font-bold">×</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sendbox;

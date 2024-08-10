// page.tsx
'use client';
import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faShare } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '@clerk/clerk-react';

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

interface Comment {
  _id: string;
  messageId: string;
  userId: string;
  comment: string;
  username: string;
  createdAt: string;
}

const AllInfoPage: React.FC = () => {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<string>('');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get<Message[]>('http://localhost:5000/api/messages');
        setMessages(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching messages');
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    if (selectedMessageId) {
      const fetchComments = async () => {
        try {
          const response = await axios.get<Comment[]>(`http://localhost:5000/api/comments/message/${selectedMessageId}`);
          setComments(prev => ({ ...prev, [selectedMessageId]: response.data }));
        } catch (err) {
          console.error('Error fetching comments');
        }
      };

      fetchComments();
    }
  }, [selectedMessageId]);

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

  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async (e: FormEvent, messageId: string) => {
    e.preventDefault();

    if (!user) return;

    const { firstName, lastName, id } = user;

    try {
      await axios.post('http://localhost:5000/api/comments', {
        messageId,
        userId: id,
        comment: newComment,
        username: `${firstName} ${lastName}`,
      });

      setNewComment('');
      setSelectedMessageId(messageId);
      // Optionally, refetch comments here if needed
    } catch (err) {
      console.error('Error posting comment');
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
      <h1 className="text-3xl font-bold mb-6 text-gray-800">All Thoughts</h1>
      <div className="space-y-4">
        {messages.map((msg) => (
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
                {/* Action Buttons */}
                <div className="flex mt-4 space-x-6">
                 <button
                     className={`flex items-center ${msg.likedBy.includes(user?.id ?? '') ? 'text-red-500' : 'text-gray-500'} hover:text-red-700 focus:outline-none`}
                     onClick={() => handleLike(msg._id)}
                 >
                    <FontAwesomeIcon icon={faHeart} className="h-5 w-5 mr-1" />
                    {msg.likes}
                  </button>
                  <button 
                    className="flex items-center text-blue-500 hover:text-blue-700 focus:outline-none"
                    onClick={() => setSelectedMessageId(selectedMessageId === msg._id ? null : msg._id)}
                  >
                    <FontAwesomeIcon icon={faComment} className="h-5 w-5 mr-1" />
                    Comment
                  </button>
                  <button className="flex items-center text-gray-500 hover:text-gray-700 focus:outline-none">
                    <FontAwesomeIcon icon={faShare} className="h-5 w-5 mr-1" />
                    Share
                  </button>
                </div>
                {/* Comments Section */}
                {selectedMessageId === msg._id && (
                  <div className="mt-4">
                    <form onSubmit={(e) => handleCommentSubmit(e, msg._id)} className="flex flex-col">
                      <textarea
                        value={newComment}
                        onChange={handleCommentChange}
                        placeholder="Add a comment..."
                        className="p-2 border rounded-lg mb-2"
                      />
                      <button
                        type="submit"
                        className="self-end bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                      >
                        Post Comment
                      </button>
                    </form>
                    <div className="mt-2 space-y-2">
                      {comments[msg._id]?.map((comment) => (
                        <div key={comment._id} className="bg-gray-100 p-2 rounded-lg">
                          <p className="font-semibold">{comment.username}</p>
                          <p>{comment.comment}</p>
                          <p className="text-xs text-gray-500">Commented at: {new Date(comment.createdAt).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllInfoPage;

'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

interface Comment {
  _id: string;
  messageId: string;
  userId: string;
  comment: string;
  createdAt: string;
  username: string;
}

const YourComments: React.FC = () => {
  const { user } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState<string>('');

  useEffect(() => {
    const fetchComments = async () => {
      if (!user) return;

      try {
        const response = await axios.get<Comment[]>(`http://localhost:5000/api/comments/user/${user.id}`);
        setComments(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError('Error fetching comments');
        setLoading(false);
      }
    };

    fetchComments();
  }, [user]);

  const handleDelete = async (commentId: string) => {
    console.log('Deleting comment with ID:', commentId);
    try {
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`);
      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError('Error deleting comment');
    }
  };

  const handleEdit = (commentId: string, currentComment: string) => {
    setEditingCommentId(commentId);
    setEditCommentText(currentComment);
  };

  const handleUpdate = async () => {
    if (!editingCommentId) return;

    console.log('Updating comment ID:', editingCommentId, 'with text:', editCommentText);
    try {
      await axios.put(`http://localhost:5000/api/comments/${editingCommentId}`, {
        comment: editCommentText,
      });
      setComments(comments.map(comment => 
        comment._id === editingCommentId ? { ...comment, comment: editCommentText } : comment
      ));
      setEditingCommentId(null);
      setEditCommentText('');
    } catch (err) {
      console.error('Error updating comment:', err);
      setError('Error updating comment');
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
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Your Comments</h1>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment._id} className="flex items-start bg-white p-4 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition duration-150">
            {/* Profile Picture */}
            <div className="flex-shrink-0 w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
              {comment.username.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <p className="font-semibold text-gray-800 mr-2">{comment.username}</p>
                <p className="text-gray-500 text-sm">{new Date(comment.createdAt).toLocaleString()}</p>
              </div>
              {editingCommentId === comment._id ? (
                <div>
                  <textarea
                    value={editCommentText}
                    onChange={(e) => setEditCommentText(e.target.value)}
                    className="w-full p-2 mb-2 border border-gray-300 rounded"
                  />
                  <button
                    onClick={handleUpdate}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => setEditingCommentId(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-gray-800 mb-2">{comment.comment}</p>
                  <div className="flex items-center text-gray-600 text-sm space-x-4">
                    <button onClick={() => handleEdit(comment._id, comment.comment)} className="flex items-center hover:text-blue-500">
                      <FontAwesomeIcon icon={faEdit} className="h-4 w-4 mr-1" />
                      <span>Edit</span>
                    </button>
                    <button onClick={() => handleDelete(comment._id)} className="flex items-center hover:text-red-500">
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

export default YourComments;

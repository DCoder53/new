import React from 'react';
import Link from 'next/link';

const YourActivity = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Activity</h1>
      <div className="space-y-4">
        <Link href="/your-messages">
          <div className="block p-4 border rounded-lg shadow hover:bg-gray-100 transition duration-150 cursor-pointer">
            Your Messages
          </div>
        </Link>
        <Link href="/your-likes">
          <div className="block p-4 border rounded-lg shadow hover:bg-gray-100 transition duration-150 cursor-pointer">
            Your Likes
          </div>
        </Link>
        <Link href="/your-comments">
          <div className="block p-4 border rounded-lg shadow hover:bg-gray-100 transition duration-150 cursor-pointer">
            Your Comments
          </div>
        </Link>
      </div>
    </div>
  );
};

export default YourActivity;

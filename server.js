// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import models
const Message = require('./message');
const Comment = require('./comment');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/thoughts', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// New route to fetch messages from the last 24 hours
app.get('/api/messages/daily', async (req, res) => {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));

  try {
    const dailyMessages = await Message.find({
      createdAt: { $gte: twentyFourHoursAgo }
    });
    res.status(200).json(dailyMessages);
  } catch (err) {
    console.error('Error fetching daily messages:', err);
    res.status(400).json({ message: err.message });
  }
});

// Fetch messages from the last 7 days
app.get('/api/messages/weekly', async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const messages = await Message.find({ createdAt: { $gte: oneWeekAgo } }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Fetch messages from last month
app.get('/api/messages/monthly', async (req, res) => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

    const messages = await Message.find({ createdAt: { $gte: oneMonthAgo } }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// POST route to create a message
app.post('/api/messages', async (req, res) => {
  const { firstname, lastname, message, userId } = req.body;

  const newMessage = new Message({
    firstname,
    lastname,
    message,
    userId,
  });

  try {
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    console.error('Error creating message:', err);
    res.status(400).json({ message: err.message });
  }
});

// GET route to fetch messages for a user
app.get('/api/messages/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const messages = await Message.find({ userId });
    res.status(200).json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(400).json({ message: err.message });
  }
});

// PUT route to update a message
app.put('/api/messages/:id', async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, message } = req.body;

  try {
    const updatedMessage = await Message.findByIdAndUpdate(id, {
      firstname,
      lastname,
      message,
    }, { new: true });

    if (!updatedMessage) {
      console.error('Message not found');
      return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json(updatedMessage);
  } catch (err) {
    console.error('Error updating message:', err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE route to delete a message
app.delete('/api/messages/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedMessage = await Message.findByIdAndDelete(id);

    if (!deletedMessage) {
      console.error('Message not found');
      return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (err) {
    console.error('Error deleting message:', err);
    res.status(400).json({ message: err.message });
  }
});

// GET route to fetch all messages
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(400).json({ message: err.message });
  }
});

// POST route to like or unlike a message
app.post('/api/messages/:messageId/like', async (req, res) => {
  const { messageId } = req.params;
  const { userId } = req.body;

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    const hasLiked = message.likedBy.includes(userId);

    if (hasLiked) {
      message.likedBy = message.likedBy.filter(id => id !== userId);
      message.likes -= 1;
    } else {
      message.likedBy.push(userId);
      message.likes += 1;
    }

    const updatedMessage = await message.save();
    res.status(200).json(updatedMessage);
  } catch (err) {
    console.error('Error liking message:', err);
    res.status(400).json({ message: err.message });
  }
});

// POST route to create a comment
app.post('/api/comments', async (req, res) => {
  const { messageId, userId, comment, username } = req.body;

  const newComment = new Comment({
    messageId,
    userId,
    comment,
    username,
  });

  try {
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (err) {
    console.error('Error creating comment:', err);
    res.status(400).json({ message: err.message });
  }
});

// GET route to fetch comments for a message
app.get('/api/comments/message/:messageId', async (req, res) => {
  const { messageId } = req.params;

  try {
    const comments = await Comment.find({ messageId });
    res.status(200).json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(400).json({ message: err.message });
  }
});

// GET route to fetch comments for a user
app.get('/api/comments/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const comments = await Comment.find({ userId });
    res.status(200).json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(400).json({ message: err.message });
  }
});

// PUT route to update a comment
app.put('/api/comments/:id', async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  try {
    const updatedComment = await Comment.findByIdAndUpdate(id, { comment }, { new: true });

    if (!updatedComment) {
      console.error('Comment not found');
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.status(200).json(updatedComment);
  } catch (err) {
    console.error('Error updating comment:', err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE route to delete a comment
app.delete('/api/comments/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedComment = await Comment.findByIdAndDelete(id);

    if (!deletedComment) {
      console.error('Comment not found');
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(400).json({ message: err.message });
  }
});

// GET route to fetch liked messages for a user
app.get('/api/messages/liked/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const likedMessages = await Message.find({ likedBy: userId });
    res.status(200).json(likedMessages);
  } catch (err) {
    console.error('Error fetching liked messages:', err);
    res.status(400).json({ message: err.message });
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

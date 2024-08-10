const express = require('express');
const router = express.Router();
const Message = require('./message');

// Handle like and unlike requests
router.post('/:messageId/like', async (req, res) => {
  const { messageId } = req.params;
  const { userId } = req.body;

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).send('Message not found');
    }

    if (message.likedBy.includes(userId)) {
      // Unlike the message
      message.likedBy = message.likedBy.filter(id => id !== userId);
      message.likes -= 1;
    } else {
      // Like the message
      message.likedBy.push(userId);
      message.likes += 1;
    }

    await message.save();
    res.status(200).json(message);
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;

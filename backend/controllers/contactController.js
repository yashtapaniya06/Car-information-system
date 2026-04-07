const FirestoreService = require('../services/firestoreService');

const dbService = new FirestoreService();

exports.addContact = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const result = await dbService.addContact({
      name,
      email,
      message
    });

    res.status(200).json({ message: 'Saved successfully', id: result.id });

  } catch (error) {
    console.error('Contact save error:', error);
    res.status(500).json({ error: 'Failed to save contact' });
  }
};

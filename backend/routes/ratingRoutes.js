// const express = require("express");
// const router = express.Router();

// const ratingController = require("../controllers/ratingController");
// const { verifyToken } = require("../middleware/authmiddleware");

// router.get('/car/:carId', ratingController.getRatingsByCar);
// router.post('/', verifyToken, ratingController.addRating);
// router.get('/analysis', async (req, res) => {
//   try {
//     const carsSnap = await db.collection('cars').get();
//     const ratingsSnap = await db.collection('ratings').get();

//     const cars = [];
//     carsSnap.forEach(doc => cars.push(doc.data()));

//     const ratings = [];
//     ratingsSnap.forEach(doc => ratings.push(doc.data()));

//     const topCars = cars.map(car => {
//       const carRatings = ratings.filter(r => r.carId === car.carId);

//       const totalRatings = carRatings.length;
//       const avg =
//         totalRatings === 0
//           ? 0
//           : carRatings.reduce((a, b) => a + b.rating, 0) / totalRatings;

//       return {
//         ...car, // 🔥 THIS MERGES BRAND MODEL PRICE
//         averageRating: avg,
//         totalRatings: totalRatings
//       };
//     });

//     res.json({ topCars });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'analysis error' });
//   }
// });



// module.exports = router;


const express = require('express');
const router = express.Router();
const { db, admin } = require('../firebase');
const { verifyToken } = require('../middleware/authmiddleware');
const FirestoreService = require('../services/firestoreService');
const dbService = new FirestoreService();

// GET ratings by car ID
router.get('/:carId', async (req, res) => {
  try {
    const { carId } = req.params;
    const snapshot = await db.collection('ratings')
      .where('carId', '==', carId)
      .get();
    
    const ratings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(ratings);
  } catch (error) {
    console.error('Get ratings error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST add rating (requires authentication)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { carId, rating } = req.body;
    const userId = req.user.id;

    if (!carId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Invalid rating data' });
    }

    // Check if user already rated this car
    const existingRating = await db.collection('ratings')
      .where('carId', '==', carId)
      .where('userId', '==', userId)
      .get();

    let result;
    if (!existingRating.empty) {
      // Update existing rating
      const ratingDoc = existingRating.docs[0];
      await ratingDoc.ref.update({
        rating: Number(rating),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      result = { id: ratingDoc.id, carId, userId, rating: Number(rating) };
    } else {
      // Create new rating
      result = await dbService.addRating({
        carId,
        userId,
        rating: Number(rating)
      });
    }

    res.status(201).json(result);
  } catch (error) {
    console.error('Add rating error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

const { db } = require('../firebase');


// ================= ADD RATING =================
const addRating = async (req, res) => {
  try {
    const ratingData = {
      carId: req.body.carId,
      userId: req.user.uid,
      rating: Number(req.body.rating),
      comment: req.body.comment,
      createdAt: new Date()
    };

    await db.collection('ratings').add(ratingData);

    res.status(201).json({ message: "Rating added successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================= GET RATINGS BY CAR =================
const getRatingsByCar = async (req, res) => {
  try {
    const snapshot = await db
      .collection("ratings")
      .where("carId", "==", req.params.carId)
      .get();

    const ratings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(ratings);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================= CAR RATING ANALYSIS =================
const getCarRatingAnalysis  = async (req, res) => {
  try {

    const ratingsSnapshot = await db.collection('ratings').get();

    if (ratingsSnapshot.empty) {
      return res.json({ topCars: [] });
    }

    const ratings = ratingsSnapshot.docs.map(doc => doc.data());

    // Group ratings by carId
    const grouped = {};

    ratings.forEach(r => {
      if (!grouped[r.carId]) {
        grouped[r.carId] = {
          totalRatings: 0,
          totalScore: 0
        };
      }

      grouped[r.carId].totalRatings += 1;
      grouped[r.carId].totalScore += r.rating;
    });

    // Convert to array with averages
    const carStats = Object.keys(grouped).map(carId => ({
      carId,
      totalRatings: grouped[carId].totalRatings,
      averageRating:
        grouped[carId].totalScore / grouped[carId].totalRatings
    }));

    // Sort by average rating
    carStats.sort((a, b) => b.averageRating - a.averageRating);

    // Take top 3
    const topThree = carStats.slice(0, 3);

    // Fetch car details
    const topCars = await Promise.all(
      topThree.map(async (car) => {
        const carDoc = await db.collection('cars').doc(car.carId).get();
        const carData = carDoc.data();

        return {
          brand: carData?.brand,
          model: carData?.model,
          averageRating: car.averageRating,
          totalRatings: car.totalRatings
        };
      })
    );

    res.json({ topCars });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
  
};


module.exports = {
  addRating,
  getRatingsByCar,
  getCarRatingAnalysis
};

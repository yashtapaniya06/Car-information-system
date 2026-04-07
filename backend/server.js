require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { db } = require('./firebase');

// ROUTES
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
const isDevelopment = process.env.NODE_ENV !== 'production';

// ================= GLOBAL CONFIG =================
app.locals.db = db;

// ================= MIDDLEWARES =================
app.use(cors());
app.use(express.json());
app.use(helmet());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDevelopment ? 1000 : 100
}));

// ================= ROUTES =================
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);

// ================= ANALYSIS ROUTE =================
app.get('/analysis', async (req, res) => {
  try {
    const ratingsSnap = await db.collection('ratings').get();
    const carsSnap = await db.collection('cars').get();

    const ratings = ratingsSnap.docs.map(d => d.data());
    const cars = carsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    if (!ratings.length) {
      return res.json({ topCars: [], chartData: [] });
    }

    const map = {};

    ratings.forEach(r => {
      if (!map[r.carId]) {
        map[r.carId] = { total: 0, count: 0 };
      }
      map[r.carId].total += Number(r.rating || 0);
      map[r.carId].count += 1;
    });

    const topCars = Object.keys(map).map(carId => {
      const avg = map[carId].total / map[carId].count;
      const carInfo = cars.find(c => c.id === carId);

      return {
        carId,
        brand: carInfo?.brand || '',
        model: carInfo?.model || '',
        averageRating: avg,
        totalRatings: map[carId].count
      };
    });

    res.json({ topCars, chartData: topCars });

  } catch (err) {
    console.error('❌ ANALYSIS ERROR:', err);
    res.status(500).json({ error: 'Analysis error' });
  }
});

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ================= 404 HANDLER =================
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});

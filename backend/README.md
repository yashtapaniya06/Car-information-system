# Backend (mock)

Simple Express-based mock backend used for local development and testing.

How to run:

1. cd backend
2. npm install
3. npm start

Endpoints implemented:
- GET /cars
- GET /cars/:id
- POST /cardata
- GET /featured
- GET /checkmodel/:model
- GET /users
- DELETE /users/:id
- GET /contacts
- POST /contacts
- GET /ratings

This backend stores data in memory (seeded from JSON files in `DataBase/Collections`).
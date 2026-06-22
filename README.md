🎬 MovieLens Recommendation Platform

A full-stack movie recommendation platform built using React, Node.js, PostgreSQL, Prisma, Redis, and FastAPI. The application allows users to browse movies, rate them, receive personalized recommendations, and analyze their viewing preferences using machine learning.

⸻

🚀 Features

Authentication

* User Registration
* User Login
* JWT Authentication
* Protected Routes

Movie Catalog

* Browse Movies
* Search Movies
* Genre-based Browsing
* Movie Details Page
* TMDB Poster Integration

Ratings System

* Rate Movies (0.5 – 5 stars)
* Store Ratings in PostgreSQL
* Average Rating Display
* Rating Count Tracking

Recommendations

* Personalized Recommendations
* Collaborative Filtering using SVD
* Cold Start Handling
* Popular Movie Recommendations for New Users

Analytics Dashboard

* Total Ratings
* Average User Rating
* Favorite Genre
* Genre Breakdown

Performance Optimization

* Redis Caching
* Cached Recommendation Results
* Faster API Responses

Machine Learning Pipeline

* Export Ratings from Database
* Retrain Recommendation Model
* Reload Model without Restarting Service
* Real-time Recommendation Updates

Infrastructure

* Dockerized Services
* PostgreSQL Database
* Redis Cache
* FastAPI ML Service
* Express Backend API

⸻

🏗 Architecture

```
Frontend (React + TailwindCSS)
|
v
Backend (Node.js + Express)
|
—————––
|        |        |
PostgreSQL Redis  FastAPI ML
(Prisma) Cache   (SVD Model)
```

⸻

🛠 Tech Stack

Frontend

* React
* React Router
* Tailwind CSS
* Axios

Backend

* Node.js
* Express.js
* Prisma ORM
* JWT Authentication
* bcrypt

Database

* PostgreSQL

Caching

* Redis

Machine Learning

* Python
* FastAPI
* Scikit-Learn
* Surprise Library (SVD)

DevOps

* Docker
* Docker Compose

⸻

📂 Project Structure

```
MovieLens-Recommendation-Platform/

├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── api/
│
├── backend/
│   ├── routes/
│   ├── middleware/
│   ├── prisma/
│   ├── config/
│   └── server.js
│
├── ml-service/
│   ├── api.py
│   ├── train.py
│   ├── export_ratings.py
│   ├── ratings.csv
|   ├── movies.csv
│   └── model.pkl
│
└── docker-compose.yml
```

⸻

🔑 Core APIs

Authentication

```
POST /auth/register
POST /auth/login
```

Movies

```
GET /movies
GET /movies/search
GET /movies/top-rated
GET /movies/genres
GET /movies/genre/:genre
GET /movies/:id
```

Ratings

```
POST /ratings
GET /ratings/me
```

Recommendations

```
GET /recommendations/me
GET /recommendations/ml
```

Analytics

```
GET /analytics/me
```

Admin

```
POST /admin/fetch-posters
POST /admin/retrain
```

⸻

🤖 Recommendation Engine

The recommendation engine uses Collaborative Filtering with the SVD algorithm from the Surprise library.

Workflow

1. User rates movies
2. Ratings are stored in PostgreSQL
3. Ratings exported to CSV
4. SVD model trained on ratings
5. Model generates personalized recommendations
6. Recommendations cached in Redis

Retraining

```
POST /admin/retrain
```

This endpoint:

* Exports latest ratings
* Retrains SVD model
* Saves updated model
* Reloads model into FastAPI
* Clears recommendation cache

⸻

🖼 Poster Integration

Movie posters are fetched using the TMDB API.

Features:

* Automatic poster fetching
* Poster storage in database
* Missing poster fallback handling

⸻

⚡ Redis Caching

Cached Data:

* ML Recommendations
* User Recommendation Results

Benefits:

* Reduced API response time
* Reduced ML service load
* Better user experience

⸻

🐳 Running with Docker

Start Services

```bash
docker compose up –build
```

Services

Service	Port
Frontend	5173
Backend	5668
PostgreSQL	5432
Redis	6379
FastAPI ML	8000

⸻

📊 Example Recommendation Response

```json
{
“recommendations”: [
{
“movieId”: 318,
“title”: “The Shawshank Redemption”,
“predictedRating”: 5.0,
“recommendationScore”: 4.56
}
]
}
```

⸻

🎯 Learning Outcomes

Through this project, I gained experience with:

* Full-Stack Web Development
* REST API Design
* Authentication & Authorization
* Database Design
* ORM (Prisma)
* Redis Caching
* Docker & Containerization
* Machine Learning Systems
* Recommendation Engines
* Microservice Architecture
* Model Retraining Pipelines

⸻
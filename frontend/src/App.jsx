import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MovieDetails from "./pages/MovieDetails";
import MyRatings from "./pages/MyRating";
import Recommendations from "./pages/Recommendations";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register"  element={<Register />} />
        <Route
          path="/dashboard"
          element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
          }
        />
        <Route
          path="/movie/:id"
          element={
          <ProtectedRoute>
            <MovieDetails />
          </ProtectedRoute>
          }
        />
        <Route
          path="/ratings"
          element={
          <ProtectedRoute>
            <MyRatings />
          </ProtectedRoute>
          }
        />
        <Route
          path="/recommendations"
          element={
          <ProtectedRoute>
            <Recommendations />
          </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
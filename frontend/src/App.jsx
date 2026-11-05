import CreateTask from "./pages/CreateTask";
import Tasks from "./pages/Tasks";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import GuideDashboard from "./pages/GuideDashboard";
import MemberDashboard from "./pages/MemberDashboard";
import Teams from "./pages/Teams";
import TeamDetails from "./pages/TeamDetails";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Guide Protected Routes */}
        <Route
          path="/guide-dashboard"
          element={
            <ProtectedRoute allowedRole="guide">
              <GuideDashboard />
            </ProtectedRoute>
          }
        />

        
        {/* Member Protected Route - My Tasks */}
        <Route
          path="/member-tasks"
          element={
            <ProtectedRoute allowedRole="member">
              <Tasks />
            </ProtectedRoute>
          }
        />


        <Route
          path="/teams"
          element={
            <ProtectedRoute allowedRole="guide">
              <Teams />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teams/:id"
          element={
            <ProtectedRoute allowedRole="guide">
              <TeamDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute allowedRole="guide">
              <Tasks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-task"
          element={
            <ProtectedRoute allowedRole="guide">
              <CreateTask />
            </ProtectedRoute>
          }
        />

        {/* Member Protected Routes */}
        <Route
          path="/member-dashboard"
          element={
            <ProtectedRoute allowedRole="member">
              <MemberDashboard />
            </ProtectedRoute>
          }
        />
        
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;

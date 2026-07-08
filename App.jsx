import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Public Pages
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Job Seeker Pages
import SeekerDashboard from "./pages/SeekerDashboard";
import Profile from "./pages/Profile";

// Employer Pages
import EmployerDashboard from "./pages/EmployerDashboard";
import CreateCompany from "./pages/CreateCompany";
import CreateJob from "./pages/CreateJob";
import EditJob from "./pages/EditJob";
import Applicants from "./pages/Applicants";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";

// 404
import NotFound from "./pages/NotFound";

function App() {
    const { loading } = useAuth();

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="container">
                    <div className="loading-spinner">
                        <h2>Loading...</h2>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main className="main-content">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/jobs" element={<Jobs />} />
                    <Route path="/jobs/:id" element={<JobDetails />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Job Seeker Routes */}
                    <Route 
                        path="/seeker-dashboard" 
                        element={
                            <ProtectedRoute allowedRoles={["job_seeker"]}>
                                <SeekerDashboard />
                            </ProtectedRoute>
                        } 
                    />
                    
                    {/* Profile - Both roles */}
                    <Route 
                        path="/profile" 
                        element={
                            <ProtectedRoute allowedRoles={["job_seeker", "employer"]}>
                                <Profile />
                            </ProtectedRoute>
                        } 
                    />

                    {/* Employer Routes */}
                    <Route 
                        path="/employer-dashboard" 
                        element={
                            <ProtectedRoute allowedRoles={["employer"]}>
                                <EmployerDashboard />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/company/create" 
                        element={
                            <ProtectedRoute allowedRoles={["employer"]}>
                                <CreateCompany />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/jobs/create" 
                        element={
                            <ProtectedRoute allowedRoles={["employer"]}>
                                <CreateJob />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/jobs/edit/:id" 
                        element={
                            <ProtectedRoute allowedRoles={["employer"]}>
                                <EditJob />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/applicants" 
                        element={
                            <ProtectedRoute allowedRoles={["employer"]}>
                                <Applicants />
                            </ProtectedRoute>
                        } 
                    />

                    {/* Admin Routes */}
                    <Route 
                        path="/admin" 
                        element={
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        } 
                    />

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
            <Footer />
        </>
    );
}

export default App;
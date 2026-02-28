import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import PatientDashboard from './pages/patient/PatientDashboard';
import ReportUpload from './pages/patient/ReportUpload';
import ReportList from './pages/patient/ReportList';
import ReportAnalysis from './pages/patient/ReportAnalysis';
import DoctorSearch from './pages/patient/DoctorSearch';
import AppointmentBooking from './pages/patient/AppointmentBooking';
import PatientProfile from './pages/patient/PatientProfile';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorReportsReview from './pages/doctor/PatientReportsReview';
import DoctorSchedule from './pages/doctor/DoctorSchedule';
import DoctorProfile from './pages/doctor/DoctorProfile';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Patient Routes - Protected */}
            <Route path="/patient/dashboard" element={
              <ProtectedRoute allowedRole="patient">
                <PatientDashboard />
              </ProtectedRoute>
            } />
            <Route path="/patient/upload" element={
              <ProtectedRoute allowedRole="patient">
                <ReportUpload />
              </ProtectedRoute>
            } />
            <Route path="/patient/reports" element={
              <ProtectedRoute allowedRole="patient">
                <ReportList />
              </ProtectedRoute>
            } />
            <Route path="/patient/reports/:reportId" element={
              <ProtectedRoute allowedRole="patient">
                <ReportAnalysis />
              </ProtectedRoute>
            } />
            <Route path="/patient/doctors" element={
              <ProtectedRoute allowedRole="patient">
                <DoctorSearch />
              </ProtectedRoute>
            } />
            <Route path="/patient/book/:doctorId" element={
              <ProtectedRoute allowedRole="patient">
                <AppointmentBooking />
              </ProtectedRoute>
            } />
            <Route path="/patient/profile" element={
              <ProtectedRoute allowedRole="patient">
                <PatientProfile />
              </ProtectedRoute>
            } />

            {/* Doctor Routes - Protected */}
            <Route path="/doctor/dashboard" element={
              <ProtectedRoute allowedRole="doctor">
                <DoctorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/doctor/reports" element={
              <ProtectedRoute allowedRole="doctor">
                <DoctorReportsReview />
              </ProtectedRoute>
            } />
            <Route path="/doctor/schedule" element={
              <ProtectedRoute allowedRole="doctor">
                <DoctorSchedule />
              </ProtectedRoute>
            } />
            <Route path="/doctor/profile" element={
              <ProtectedRoute allowedRole="doctor">
                <DoctorProfile />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

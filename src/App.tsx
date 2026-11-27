import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';

// Lazy-load every route for optimal bundle size
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const PricingPage = lazy(() => import('./pages/public/PricingPage'));
const HelpCenterPage = lazy(() => import('./pages/public/HelpCenterPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/public/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/public/TermsOfServicePage'));
const HipaaCompliancePage = lazy(() => import('./pages/public/HipaaCompliancePage'));
const PatientDashboard = lazy(() => import('./pages/patient/PatientDashboard'));
const ReportUpload = lazy(() => import('./pages/patient/ReportUpload'));
const ReportList = lazy(() => import('./pages/patient/ReportList'));
const ReportAnalysis = lazy(() => import('./pages/patient/ReportAnalysis'));
const DoctorSearch = lazy(() => import('./pages/patient/DoctorSearch'));
const AppointmentBooking = lazy(() => import('./pages/patient/AppointmentBooking'));
const PatientProfile = lazy(() => import('./pages/patient/PatientProfile'));
const DoctorDashboard = lazy(() => import('./pages/doctor/DoctorDashboard'));
const DoctorReportsReview = lazy(() => import('./pages/doctor/PatientReportsReview'));
const DoctorSchedule = lazy(() => import('./pages/doctor/DoctorSchedule'));
const DoctorProfile = lazy(() => import('./pages/doctor/DoctorProfile'));

function PageFallback() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-sm font-medium text-gray-400">Loading page...</p>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route element={<Layout />}>
              {/* Public */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/help" element={<HelpCenterPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />
              <Route path="/hipaa" element={<HipaaCompliancePage />} />

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
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

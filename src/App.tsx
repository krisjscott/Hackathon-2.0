import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './i18n';

// Layout components
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages (lazy loaded)
const HomePage = React.lazy(() => import('./pages/HomePage'));
const AboutUsPage = React.lazy(() => import('./pages/about_us_page'));
const SearchResultsPage = React.lazy(() => import('./pages/SearchResultsPage'));
const PropertyDetailsPage = React.lazy(() => import('./pages/PropertyDetailsPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const UserDashboardPage = React.lazy(() => import('./pages/UserDashboardPage'));

function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/results" element={<SearchResultsPage />} />
            <Route path="/property/:id" element={<PropertyDetailsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<UserDashboardPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
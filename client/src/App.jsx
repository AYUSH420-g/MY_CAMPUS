import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { MarketplacePage } from './pages/MarketplacePage';
import { MarketplaceDetailPage } from './pages/MarketplaceDetailPage';
import { LostFoundPage } from './pages/LostFoundPage';
import { LostFoundDetailPage } from './pages/LostFoundDetailPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Modals
import { CreateMarketplaceModal } from './components/CreateMarketplaceModal';
import { ReportLostFoundModal } from './components/ReportLostFoundModal';
import { MatchModal } from './components/MatchModal';
import { ContactModal } from './components/ContactModal';

export default function App() {
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportModalInitialType, setReportModalInitialType] = useState('lost');

  // Match Modal state
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [matchModalItem, setMatchModalItem] = useState(null);

  // Contact Modal state
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactModalItem, setContactModalItem] = useState(null);

  const handleOpenReportModal = (type = 'lost') => {
    setReportModalInitialType(type);
    setReportModalOpen(true);
  };

  const handleOpenMatches = (item) => {
    setMatchModalItem(item);
    setMatchModalOpen(true);
  };

  const handleContact = (item) => {
    setContactModalItem(item);
    setContactModalOpen(true);
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
          <Navbar
            onOpenPostModal={() => setPostModalOpen(true)}
            onOpenReportModal={() => handleOpenReportModal('lost')}
          />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    onOpenPostModal={() => setPostModalOpen(true)}
                    onOpenReportModal={handleOpenReportModal}
                    onOpenMatches={handleOpenMatches}
                    onContact={handleContact}
                  />
                }
              />
              <Route
                path="/marketplace"
                element={
                  <MarketplacePage
                    onOpenPostModal={() => setPostModalOpen(true)}
                    onContact={handleContact}
                  />
                }
              />
              <Route
                path="/marketplace/:id"
                element={<MarketplaceDetailPage onContact={handleContact} />}
              />
              <Route
                path="/lost-and-found"
                element={
                  <LostFoundPage
                    onOpenReportModal={handleOpenReportModal}
                    onOpenMatches={handleOpenMatches}
                  />
                }
              />
              <Route
                path="/lost-and-found/:id"
                element={<LostFoundDetailPage onContact={handleContact} />}
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage
                      onOpenPostModal={() => setPostModalOpen(true)}
                      onOpenReportModal={handleOpenReportModal}
                      onOpenMatches={handleOpenMatches}
                    />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />

          {/* Global Modals */}
          <CreateMarketplaceModal
            isOpen={postModalOpen}
            onClose={() => setPostModalOpen(false)}
            onItemCreated={() => {
              window.dispatchEvent(new CustomEvent('campuscircle:itemCreated'));
            }}
          />

          <ReportLostFoundModal
            isOpen={reportModalOpen}
            initialType={reportModalInitialType}
            onClose={() => setReportModalOpen(false)}
            onItemReported={(item, topMatches) => {
              if (topMatches && topMatches.length > 0) {
                // Auto-trigger matches modal to show user the instant match!
                setTimeout(() => {
                  handleOpenMatches(item);
                }, 300);
              }
            }}
          />

          <MatchModal
            isOpen={matchModalOpen}
            item={matchModalItem}
            onClose={() => {
              setMatchModalOpen(false);
              setMatchModalItem(null);
            }}
            onResolved={() => {
              window.dispatchEvent(new CustomEvent('campuscircle:itemResolved'));
            }}
          />

          <ContactModal
            isOpen={contactModalOpen}
            item={contactModalItem}
            onClose={() => {
              setContactModalOpen(false);
              setContactModalItem(null);
            }}
          />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

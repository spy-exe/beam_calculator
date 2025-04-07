import React, { lazy, Suspense } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate 
} from 'react-router-dom';

import { ProjectManagerProvider } from './contexts/ProjectManagerContext.tsx';
import { AnalyticsProvider } from './contexts/AnalyticsContext.tsx';
import { BeamCalculationProvider } from './contexts/BeamCalculationContext.tsx';

import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
// import LoadingSpinner from './components/ui/LoadingSpinner';

// Importações lazy para carregamento sob demanda
const Dashboard = lazy(() => import('./pages/Dashboard.tsx'));
const BeamAnalysis = lazy(() => import('./pages/BeamAnalysis.tsx'));
const MaterialLibrary = lazy(() => import('./pages/MaterialLibrary.tsx'));

const App: React.FC = () => {
  return (
    <Router>
      <ProjectManagerProvider>
        <AnalyticsProvider>
          <BeamCalculationProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <div className="flex flex-1 mt-16">
                <Sidebar />
                <main className="flex-1 ml-20 p-6">
                  {/* <Suspense fallback={<LoadingSpinner />}> */}
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/beam-analysis" element={<BeamAnalysis />} />
                      <Route path="/materials" element={<MaterialLibrary />} />
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  {/* </Suspense> */}
                </main>
              </div>
              <Footer />
            </div>
          </BeamCalculationProvider>
        </AnalyticsProvider>
      </ProjectManagerProvider>
    </Router>
  );
};

export default App;
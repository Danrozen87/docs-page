import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DocsLayout } from './layouts/DocsLayout';
import { LandingPage } from './pages/LandingPage';
import { DocPage } from './pages/DocPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing — full width, no sidebar */}
        <Route
          path="/"
          element={
            <DocsLayout fullWidth>
              <LandingPage />
            </DocsLayout>
          }
        />

        {/* All docs pages — sidebar + optional TOC */}
        <Route
          path="/docs/*"
          element={
            <DocsLayout>
              <DocPage />
            </DocsLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

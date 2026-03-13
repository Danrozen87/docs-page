import { Suspense, lazy } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';

const IntroductionPage = lazy(() =>
  import('./docs/IntroductionPage').then((module) => ({ default: module.IntroductionPage })),
);
const InstallationPage = lazy(() =>
  import('./docs/InstallationPage').then((module) => ({ default: module.InstallationPage })),
);
const UsagePage = lazy(() =>
  import('./docs/UsagePage').then((module) => ({ default: module.UsagePage })),
);
const SeamPage = lazy(() =>
  import('./docs/SeamPage').then((module) => ({ default: module.SeamPage })),
);
const MessagesPage = lazy(() =>
  import('./docs/MessagesPage').then((module) => ({ default: module.MessagesPage })),
);
const ConventionsPage = lazy(() =>
  import('./docs/ConventionsPage').then((module) => ({ default: module.ConventionsPage })),
);
const MigrationPage = lazy(() =>
  import('./docs/MigrationPage').then((module) => ({ default: module.MigrationPage })),
);
const ThemingPage = lazy(() =>
  import('./docs/ThemingPage').then((module) => ({ default: module.ThemingPage })),
);
const ComponentPage = lazy(() =>
  import('./docs/ComponentPage').then((module) => ({ default: module.ComponentPage })),
);

function DocRouteFallback() {
  return (
    <div className="docs-section">
      <div className="docs-route-loading" aria-live="polite">
        Loading section...
      </div>
    </div>
  );
}

export function DocPage() {
  return (
    <Suspense fallback={<DocRouteFallback />}>
      <Routes>
        {/* Guide pages */}
        <Route index element={<IntroductionPage />} />
        <Route path="introduction" element={<IntroductionPage />} />
        <Route path="installation" element={<InstallationPage />} />
        <Route path="usage" element={<UsagePage />} />
        <Route path="seam" element={<SeamPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="conventions" element={<ConventionsPage />} />
        <Route path="migrating-from-shadcn-ui" element={<MigrationPage />} />
        <Route path="migrating-from-shadcn-radix" element={<Navigate to="/docs/migrating-from-shadcn-ui" replace />} />
        <Route path="theming" element={<ThemingPage />} />
        <Route path="dark-mode" element={<Navigate to="/docs/theming#dark-mode" replace />} />

        {/* Shortcut routes */}
        <Route path="getting-started" element={<IntroductionPage />} />
        <Route path="components" element={<ComponentPage />} />

        {/* Individual component pages */}
        <Route path="components/:componentId" element={<ComponentPage />} />

        {/* Fallback */}
        <Route path="*" element={<IntroductionPage />} />
      </Routes>
    </Suspense>
  );
}

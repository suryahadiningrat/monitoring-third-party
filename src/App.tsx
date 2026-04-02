import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Services } from './pages/Services';
import { Reminders } from './pages/Reminders';
import { Costs } from './pages/Costs';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="services" element={<Services />} />
            <Route path="reminders" element={<Reminders />} />
            <Route path="costs" element={<Costs />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

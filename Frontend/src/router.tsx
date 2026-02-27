import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';
import { RoutesPage } from './pages/Routes/RoutesPage';
import { ComparePage } from './pages/Compare/ComparePage';
import { BankingPage } from './pages/Banking/BankingPage';
import { PoolingPage } from './pages/Pooling/PoolingPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/routes" replace /> },
      { path: 'routes', element: <RoutesPage /> },
      { path: 'compare', element: <ComparePage /> },
      { path: 'banking', element: <BankingPage /> },
      { path: 'pooling', element: <PoolingPage /> },
    ],
  },
]);


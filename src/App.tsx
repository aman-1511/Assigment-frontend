import React from 'react';
import { 
  createBrowserRouter, 
  RouterProvider, 
  Outlet, 
  createRoutesFromElements, 
  Route 
} from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CampaignForm from './pages/CampaignForm';
import MessageGenerator from './pages/MessageGenerator';
import './styles/global.css';

// Root layout component with navbar
const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

// Create router without incompatible future flags
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Dashboard />} />
      <Route path="campaign/new" element={<CampaignForm />} />
      <Route path="campaign/edit/:id" element={<CampaignForm />} />
      <Route path="message-generator" element={<MessageGenerator />} />
    </Route>
  )
);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App; 
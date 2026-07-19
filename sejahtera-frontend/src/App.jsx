import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Nutrisi from './pages/Nutrisi';
import MetrikKesehatan from './pages/MetrikKesehatan';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/nutrisi" element={<Nutrisi />} /> 
        <Route path="/metrik" element={<MetrikKesehatan />} />
      </Routes>
    </Router>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Nutrisi from './pages/Nutrisi';
import MetrikKesehatan from './pages/MetrikKesehatan';
import Bantuan from './pages/Bantuan';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/nutrisi" element={<Nutrisi />} /> 
        <Route path="/metrik" element={<MetrikKesehatan />} />
        <Route path="/bantuan" element={<Bantuan />} />
      </Routes>
    </Router>
  );
}

export default App;
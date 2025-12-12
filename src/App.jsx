import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AuctionDetails from './pages/AuctionDetails';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auction/:id" element={<AuctionDetails />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App;
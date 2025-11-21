import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AuctionDetails from './pages/AuctionDeetails';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auction/:id" element={<AuctionDetails />} />
    </Routes>
  )
}

export default App;
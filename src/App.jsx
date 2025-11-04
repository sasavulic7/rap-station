import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home.jsx'
import Liked from './pages/Liked.jsx'
import Playlists from './pages/Playlists.jsx';
import PlaylistDetails from "./pages/PlaylistDetails.jsx"
import Radio from "./pages/Radio.jsx"


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/liked" element={<Liked />} />
        <Route path="playlists" element={<Playlists />} />
        <Route path="/playlists/:id" element={<PlaylistDetails />} />
        <Route path="/radio" element={<Radio />} />

      </Routes>
    </Router>
  );
}

export default App

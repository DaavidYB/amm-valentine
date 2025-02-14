import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ModeProvider, useMode } from './context/ModeContext';
import ImageComponent from './components/ImageComponent';
import PageTemplate from './components/PageTemplate';
import Match from './pages/Match';
import Playlist from './pages/Playlist';
import SecretValentine from './pages/SecretValentine';
import ILoveU from './pages/ILoveU';

function AppContent() {
  const { mode } = useMode();

  return (
    <div className={mode === 'love' ? 'love-mode' : 'anti-love-mode'}>
      <Routes>
        <Route path="/" element={<PageTemplate><ImageComponent /></PageTemplate>} />
        <Route path="/match" element={<PageTemplate><Match /></PageTemplate>} />
        <Route path="/playlist" element={<PageTemplate><Playlist /></PageTemplate>} />
        <Route path="/secret-valentine" element={<PageTemplate><SecretValentine /></PageTemplate>} />
        <Route path="/iloveu" element={<PageTemplate><ILoveU /></PageTemplate>} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ModeProvider>
      <Router>
        <AppContent />
      </Router>
    </ModeProvider>
  );
}

export default App;

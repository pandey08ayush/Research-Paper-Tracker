import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AddPaperForm from './components/AddPaperForm';
import PaperLibrary from './components/PaperLibrary';
import Analytics from './components/Analytics';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePaperAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/add-paper" replace />} />
            <Route 
              path="/add-paper" 
              element={<AddPaperForm onPaperAdded={handlePaperAdded} />} 
            />
            <Route 
              path="/library" 
              element={<PaperLibrary refreshTrigger={refreshTrigger} />} 
            />
            <Route 
              path="/analytics" 
              element={<Analytics refreshTrigger={refreshTrigger} />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
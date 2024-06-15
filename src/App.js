import './App.css';
import TodoApp from './TodoApp';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
    return (
        <div className="App">
            <DndProvider backend={HTML5Backend}>
                <TodoApp />
            </DndProvider>
        </div>
    );
}

export default App;

/*import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import TodoApp from './TodoApp';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = (success) => {
        setIsAuthenticated(success);
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/todos" element={isAuthenticated ? <TodoApp /> : <Navigate to="/login" />} />
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;*/



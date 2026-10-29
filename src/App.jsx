import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TaskManager from './pages/TaskManager';
import ReduxCounter from './pages/ReduxCounter';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TaskManager />} />
        <Route path="/redux" element={<ReduxCounter />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
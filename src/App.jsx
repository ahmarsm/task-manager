import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TaskManager from './pages/TaskManager';
import ReduxCounter from './pages/ReduxCounter';
import ShoppingCart from './pages/ShoppingCart';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TaskManager />} />
        <Route path="/redux" element={<ReduxCounter />} />
        <Route path="/cart" element={<ShoppingCart />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
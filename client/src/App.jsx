import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home/Home';
import TimeLockWallet from './pages/TimeLockWallet/TimeLockWallet';

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route>
        <Route index element={<Home />} />
        <Route path="time-lock-wallet" element={<TimeLockWallet />} />
        <Route path="*" element={<div>404, Page Not Found</div>} />
      </Route>
    </Routes>
  </BrowserRouter>
  )
}

export default App

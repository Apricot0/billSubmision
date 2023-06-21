
import './App.css';
import {Route, Routes } from 'react-router-dom';
import Submission from './pages/Submission';
import Home from './pages/Home';
import Login from './pages/Login';
import Confirmation from './pages/Confirmation';
import NotFound from './pages/NotFound';
import BillEdit from './pages/BillEdit';

function App() {
  return (
    <div>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/home" element={<Home />} /> {/* Home page */}
          <Route path="/submission" element={<Submission/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/billEdit/:billId" element={<BillEdit/>} />
          {/*<Route path="/billDetail/:billId" element={<BillDetail/>} />*/}
          <Route path="/billConfirm/:billId" element={<Confirmation/>} />
          <Route path='*' element={<NotFound/>} /> {/*404 page */}
        </Routes>
    </div>
  );
}

export default App;

import Home from './components/pages/Home';
import Login from './components/pages/account/Login';
import Logout from './components/pages/account/Logout';
import Messages from './components/pages/account/Messages';
import Profile from './components/pages/account/Profile';
import Search from './components/pages/Search';
import CreateAccount from './components/pages/account/CreateAccount';

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import './App.css'
import Posts from './components/pages/Posts';
import Papers from './components/pages/Papers';

function App() {
  return (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/createAccount" element={<CreateAccount />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/posts" element={<Posts />} />
      <Route path="/posts/:targetAccountId" element={<Posts />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/search" element={<Search />} />
      <Route path="/search/accountPapers/:accountId" element={<Papers />} />
    </Routes>
  </Router>
  )
}

export default App;

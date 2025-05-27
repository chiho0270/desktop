import { Link } from 'react-router-dom';
import React from 'react';
import './Nav.css';
import { useAuth } from './context/AuthContext';
import { FaHome } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FaRobot } from "react-icons/fa";
import { TbVs } from "react-icons/tb";
import { FaChartLine } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { MdFavorite } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";
import Button from 'react-bootstrap/Button';

function Nav() {
  const { isLoggedIn, logout } = useAuth();
  return (
    <div className="navbar">
      <h4 style={{ fontSize: '22px' }}>Discover</h4>
      <Link className="navbarMenu" to={'/'}><FaHome /> Home</Link>
      <Link className="navbarMenu" to={'/Search'}><FaSearch /> Search</Link>
      <Link className="navbarMenu" to={'/Chatbot'}><FaRobot /> Chatbot</Link>
      <Link className="navbarMenu" to={'/Comparison'}><TbVs /> Comparison</Link>
      <Link className="navbarMenu" to={'/Chart'}><FaChartLine /> Chart</Link>
      <h4 style={{ fontSize: '22px' }}>Library</h4>
      <Link className="navbarMenu" to={'/History'}><FaHistory /> History</Link>
      <Link className="navbarMenu" to={'/Wishlist'}><MdFavorite /> Wishlist</Link>
      {/* User 페이지는 로그인 했을 때만 보임 */}
      {isLoggedIn && (
        <Link className="navbarMenu user-link" to={'/User'}><FaRegUserCircle /> </Link>
      )}

      {/* 로그인/회원가입 버튼: 로그인 안 했을 때만 보임 */}
      {!isLoggedIn && (
        <div className="nav-buttons">
          <Link to="/Login">
            <Button variant="link" className="nav-button">Login</Button>
          </Link>
          <Link to="/Signup">
            <Button variant="link" className="nav-button">Signup</Button>
          </Link>
        </div>
      )}
      {/* 로그아웃 버튼: 로그인 했을 때만 보임 */}
      {isLoggedIn && (
        <div className="nav-buttons">
          <Button variant="link" className="nav-button" onClick={logout}>Logout</Button>
        </div>
      )}
    </div>
  );
}

export default Nav;

import React from 'react';
import Nav from './Nav';
import './layout.css';

function Layout({ children }) {
  return (
    <>
      <div className="header-and-nav">
        <h1>UPsetUP</h1>
        <Nav />
      </div>
      <div className="content-container">
        {children}
      </div>
    </>
  );
}

export default Layout;

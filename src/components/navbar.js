import React from 'react';
import { Navbar, Nav,  } from "react-bootstrap"
import { Link } from 'react-router-dom';


export const NavBar = (props) => {
  return (
    <Navbar bg="primary" expand="lg">
      <Link to="/" className="navbar-brand">Interview Scheduler</Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/interviews" className="nav-link">Interviews</Link>
          <Link to="/participants" className="nav-link">Participants</Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}
import React, { useState } from 'react';
import {
	Button,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
  Badge,
} from 'reactstrap';

import { Link } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NavBar = (props) => {

	const [isOpen, setIsOpen] = useState(false);
	const toggle = () => setIsOpen(!isOpen);

	const test = () => {
		console.log(props.data.authenticated)
	}

	return (
		<div className="main-nav">
      <Navbar expand="md">
        <Link to="/" className="main-link"><FontAwesomeIcon icon="caret-left"/> BACK TO MAIN MENU</Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
          </Nav>
          <NavbarText className="notification-icon"><FontAwesomeIcon className="esBlue" icon="bell" /><Badge color="danger">100</Badge></NavbarText>
          <NavbarText className="user-text esBlue">Welcome, <b>Admin User Full Name</b></NavbarText>
          <NavbarText className="logout"><FontAwesomeIcon icon="sign-out-alt" className="esBlue" /></NavbarText>
        </Collapse>
      </Navbar>
    </div>
	);
}

export default NavBar;

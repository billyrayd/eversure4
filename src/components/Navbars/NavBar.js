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
  NavbarText
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
      <Navbar color="light" light expand="md">
        <Link to="/" className="main-link"><FontAwesomeIcon icon="caret-left"/> BACK TO MAIN MENU</Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
          </Nav>
          <NavbarText className="user-text">Admin User Full Name</NavbarText>
          <NavbarText className="logout"><FontAwesomeIcon icon="sign-out-alt" className="black" /></NavbarText>
        </Collapse>
      </Navbar>
    </div>
	);
}

export default NavBar;

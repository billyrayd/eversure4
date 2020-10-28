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

import EversureLogo from 'assets/logo/eversure_logo.png';

var $ = require( 'jquery' );

export default class NavBar extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    }
  }

  toggleSidebar = () => {
    $(".sidebar").toggle();
    $(".sidebar-wrap").toggleClass("es-overlay");
    document.body.classList.toggle("disable-scroll");
  }

  toggle = () => {
    let { isOpen } = this.state;
    this.setState({isOpen: !isOpen})
  }

  toggleMenu = () => {

  }

  render() {
    let { isOpen } = this.state;
    let { system } = this.props;
    const mainLink = system == "Inventory" ? "/" : "/accounting/";
    return (
      <div className="main-nav">
        <Navbar expand="md">
          <FontAwesomeIcon className="toggle-sidebar" icon="bars" onClick={this.toggleSidebar} />
          <img src={EversureLogo} alt="logo" className="logo" />
          <Link to={mainLink} className="main-link"><FontAwesomeIcon icon="caret-left"/> BACK TO MAIN MENU</Link>
          <div className="current-user"><b>Super Admin</b></div>
          <FontAwesomeIcon className="toggle-menu" icon="ellipsis-v" onClick={this.toggleMenu} />
          <div className="notification-count">
            <Badge color="danger">29</Badge>
          </div>
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
}

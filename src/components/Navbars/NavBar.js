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
  Tooltip,
} from 'reactstrap';

import { Link } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import EversureLogo from 'assets/logo/eversure_logo.png';

var $ = require( 'jquery' );

export default class NavBar extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      tooltipOpen: false
    }
  }

  componentDidMount(){
    $(document).on("click", function(e){
      var target = e.target;

      if(typeof target.className === "string"){
        if(target.className.indexOf("notification-count") === -1){
          $("#customMenu").removeClass("open");
        }
      }
    })

    // console.log(!this.props.data.authenticated)
  }

  componentDidUpdate(){
    if(!this.props.data.authenticated){
      this.props.history.push("/")
    }
  }

  openSidebar = () => {
    // $(".sidebar").toggle();
    document.getElementById("sideBar").style.width = "200px";
    document.getElementById("appVersion").style.bottom = "0px";
    $("#customMenu").removeClass("open");
    $(".sidebar-wrap").addClass("es-overlay");
    // document.body.classList.toggle("disable-scroll");
    $("body").addClass("disable-scroll");
  }
  toggle = () => {
    let { isOpen } = this.state;
    this.setState({isOpen: !isOpen})
  }
  toggleMenu = () => {
    $("#customMenu").toggleClass("open");
  }
  goTo = (path) => {
    this.props.history.push(path)
  }
  logOut = () => {
    this.props.logout();
  }
  toggleTooltip = () => {
    let { tooltipOpen } = this.state;
    this.setState({tooltipOpen: !tooltipOpen})
  }

  render() {
    let { isOpen,tooltipOpen } = this.state;
    let { system } = this.props;
    const mainLink = system == "Inventory" ? "/" : "/accounting/";
    return (
      <div className="main-nav">
        <Navbar expand="md">
          <FontAwesomeIcon className="toggle-sidebar" icon="bars" onClick={this.openSidebar} />
          <img src={EversureLogo} alt="logo" className="logo" />
          <Link to={mainLink} className="main-link"><FontAwesomeIcon icon="caret-left"/> BACK TO MAIN MENU</Link>
          <div className="current-user"><b>Super Admin</b></div>
          <span onClick={this.toggleMenu} >
            <FontAwesomeIcon className="toggle-menu" icon="ellipsis-v"/>
            <div className="notification-count">
              <Badge color="danger">29</Badge>
            </div>
          </span>
          <div className="custom-menu" id="customMenu">
            <ul>
              <li className="notifications-link" onClick={() => this.goTo("/reset_password_notifications/")}><span>Notifications <Badge color="danger">29</Badge></span></li>
              <li onClick={this.logOut}><span>Logout</span></li>
            </ul>
          </div>
          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
            </Nav>
            <NavbarText className="notification-icon">
              <FontAwesomeIcon className="esBlue" icon="bell" /><Badge color="danger">100</Badge>
            </NavbarText>
            <NavbarText className="user-text esBlue">
              Welcome, <b>Admin User Full Name</b>
            </NavbarText>
            <NavbarText id="logout" className="logout" onClick={this.logOut}>
              <FontAwesomeIcon icon="sign-out-alt" className="esBlue" />
              <Tooltip
                placement="left"
                isOpen={tooltipOpen}
                target={"logout"}
                toggle={this.toggleTooltip}
              >
                Logout
              </Tooltip>
            </NavbarText>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

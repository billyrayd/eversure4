import React, { useState } from 'react';

import feathers from 'helpers/feathers';

//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as AuthActions from 'actions/auth';
import * as CategoryActions from 'actions/prev/category';
import * as UserActions from 'actions/prev/users';

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
import toastr from 'toastr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import EversureLogo from 'assets/logo/eversure_logo.png';

var $ = require( 'jquery' );

class NavBar extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      tooltipOpen: false,
      notifTooltipOpen: false,
    }
  }

  componentDidMount(){
    const that = this;
    let { activeTime,authenticated, } = this.props;
    $(document).on("click", function(e){
      var target = e.target;

      if(typeof target.className === "string"){
        if(target.className.indexOf("notification-count") === -1){
          $("#customMenu").removeClass("open");
        }
      }
    })

    window.addEventListener("scroll", function(){
      var scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;

      if(scrollTop > 50){
        $(".main-nav").addClass("scrolled");
      }else{
        $(".main-nav").removeClass("scrolled");
      }
    })

    this.loadListeners();
    this.loadSettings();

    if(activeTime){
      let timeNow = new Date();
      let lastActiveTime = activeTime;

      let diff = ((timeNow - new Date(lastActiveTime) ) / 1000);

      if(diff > 3600){ // logout if inactivity lasts more than 3600 seconds or 1 hour
        that.props.actions.LoginUser(false);
        that.props.history.push("/");
      }
    }

    let now = new Date();
    that.props.actions.SetActiveTime(now);

    feathers.reAuthenticate()
    .then(() => {
    })
    .catch((e) => {
      if(e.code == "408"){
        toastr.remove();
        toastr.error("Lost connection to the server");
      }
    })
  }

  componentDidUpdate(){
    if(!this.props.data.authenticated){
      // this.props.history.push("/")
    }
  }

  loadListeners = () => {
    const that = this;
    feathers.service("branches").on("created", function(s){
      // that.loadSettings();
    })
  }

  loadSettings = () => {
    /* set brands for datatables and select options */
    this.props.actions.GetAllBrands();
    /* set branches for datatables and select options */
    this.props.actions.GetAllBranches();
    /* set models for datatables and select options */
    this.props.actions.GetCategoryModels();
    /* set positions/designation for datatables and select options */
    this.props.actions.GetUserDesignation();

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
  logoutTooltip = () => {
    let { tooltipOpen } = this.state;
    this.setState({tooltipOpen: !tooltipOpen})
  }
  notifTooltip = () => {
    let { notifTooltipOpen } = this.state;
    this.setState({notifTooltipOpen: !notifTooltipOpen})
  }

  render() {
    let { isOpen,tooltipOpen,notifTooltipOpen } = this.state;
    let { system,userData } = this.props;
    let mainLink = "/";

    switch(system){
      case 'Inventory':
        mainLink = "/"; break;
      case 'Accounting':
        mainLink = "/accounting/"; break;
      case 'OldRecords':
        mainLink = "/old_records/"; break;
      default: mainLink = "/";
    }
    const notifCount = "99+"
    return (
      <div className="main-nav">
        <Navbar expand="md">
          <FontAwesomeIcon className="toggle-sidebar" icon="bars" onClick={this.openSidebar} />
          <img src={EversureLogo} alt="logo" className="logo" />
          <Link to={mainLink} className="main-link"><FontAwesomeIcon icon="caret-left"/> BACK TO MAIN MENU</Link>
          <div className="current-user"><b>{userData.fullname}</b></div>
          <span onClick={this.toggleMenu} >
            <FontAwesomeIcon className="toggle-menu" icon="ellipsis-v"/>
            <div className="notification-count">
              <Badge color="danger">{notifCount}</Badge>
            </div>
          </span>
          <div className="custom-menu" id="customMenu">
            <ul>
              <li className="notifications-link" onClick={() => this.goTo("/reset_password_notifications/")}><span>Notifications <Badge color="danger">{notifCount}</Badge></span></li>
              <li onClick={this.logOut}><span>Logout</span></li>
            </ul>
          </div>
          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
            </Nav>
            <NavbarText id="notif" className="notification-icon" onClick={() => this.goTo("/reset_password_notifications/")} style={{cursor: 'pointer'}}>
              <FontAwesomeIcon className="esBlue" icon="bell" /><Badge color="danger" style={{pointerEvents: 'none'}}>{notifCount}</Badge>
              <Tooltip
                placement="left"
                isOpen={notifTooltipOpen}
                target={"notif"}
                toggle={this.notifTooltip}
              >
                Notifications
              </Tooltip>
            </NavbarText>
            <NavbarText className="user-text esBlue">
              Welcome, <b>{userData.fullname}</b>
            </NavbarText>
            <NavbarText id="logout" className="logout" onClick={this.logOut}>
              <FontAwesomeIcon icon="sign-out-alt" className="esBlue" />
              <Tooltip
                placement="left"
                isOpen={tooltipOpen}
                target={"logout"}
                toggle={this.logoutTooltip}
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

const mapStateToProps = state => ({
  authenticated: state.user_auth.authenticated,
  loggingIn: state.user_auth.loggingIn,
  activeTime: state.user_auth.activeTime,
  userData: state.login.userData,
});

function mapDispatchToProps(dispatch) {
   return { actions: bindActionCreators(Object.assign({}, AuthActions,CategoryActions,UserActions, ), dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);

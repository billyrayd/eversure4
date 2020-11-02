import React from 'react';
import { Link } from 'react-router-dom';

import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import PerfectScrollbar from 'perfect-scrollbar';

import EversureLogo from 'assets/logo/eversure_logo.png';

var $ = require( 'jquery' );

var ps;

export default class InventorySidebar extends React.PureComponent {

	constructor(props) {
		super(props);
    this.sideBar = React.createRef();

		this.state = {
			isOpen: false
		}
	}

	componentDidMount(){
    // ps = new PerfectScrollbar(this.sideBar.current, {
    //   suppressScrollX: true,
    //   suppressScrollY: false,
    //   minScrollbarLength: 10
    // });

    const that = this;

    $("body").on("click", function(e){
    	if(typeof e.target.className === "string"){
    		if(e.target.className.split(" ")[0] == "sidebar-wrap"){
    			that.closeSidebar()
    		}
    	}
    })

    $("body").removeClass("disable-scroll");
	}

	toggle = () => {
		let { isOpen } = this.state;

		this.setState({isOpen: !isOpen})
	}

	closeSidebar = () => {
		// $(".sidebar").toggle();

    document.getElementById("sideBar").style.width = "0px";
    document.getElementById("appVersion").style.bottom = "-55px";
		$(".sidebar-wrap").removeClass("es-overlay");
    // document.body.classList.toggle("disable-scroll");
    $("body").removeClass("disable-scroll");
		
	}

	render() {
		let { isOpen } = this.state;
		let links = [
			{ name: 'Dashboard', path: '/dashboard/', icon: 'tachometer-alt', visible: true },
			{ name: 'Inventory', path: '/brand_new_in_stock/', icon: 'list', visible: true },
			{ name: 'Payments', path: '/payments/', icon: 'money-bill', visible: true },
			{ name: 'Reports', path: '/brand_new_unsold/', icon: 'file-alt', visible: true },
			{ name: 'Users', path: '/users/', icon: 'users', visible: true },
			{ name: 'Settings', path: '/brands/', icon: 'cogs', visible: true },
		]
		return (
			<div className="sidebar-wrap">
				<div className="sidebar" id="sideBar">
					<ul>
						<li className="logo-li">
							<FontAwesomeIcon className="dismiss-sidebar" icon="times" onClick={this.closeSidebar} />
							<Link to='/'>
								<img src={EversureLogo} alt="logo" className="logo" />
							</Link>
						</li>
						<li className="system-type">
							<ButtonDropdown isOpen={isOpen} toggle={this.toggle}>
					      <DropdownToggle caret>
					        Inventory System
					      </DropdownToggle>
					      <DropdownMenu>
					        <DropdownItem>
					        	<Link to="/accounting/">Accounting System</Link>
					        </DropdownItem>
					        <DropdownItem divider />
					        <DropdownItem>
					        	<Link to="/old_records/">Old Records System</Link>
					        </DropdownItem>
					      </DropdownMenu>
					    </ButtonDropdown>
						</li>
						{
							links.map((link, key) => {
								return link.visible ? <li key={key} className={this.props.component == link.name ? "nav-link active" : "nav-link"}>
												<Link to={link.path}><FontAwesomeIcon className="link-icon" icon={link.icon} />{link.name}</Link>
											</li> : null
							})
						}
						<li className="app-version" id="appVersion">
							<span>Eversure v4.0.0</span>
						</li>
					</ul>
				</div>
			</div>
		);
	}
}

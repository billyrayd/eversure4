import React from 'react';
import { Link } from 'react-router-dom';

import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { MY_APP } from 'helpers';

import EversureLogo from 'assets/logo/eversure_logo.png';

var $ = require( 'jquery' );

export default class InventorySidebar extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			isOpen: false
		}
	}
	
	componentDidMount(){
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
    document.body.classList.toggle("disable-scroll");
	}

	render() {
		let { isOpen } = this.state;
		let links = [
			{ name: 'Customers', path: '/brandnew_customer_installment/', icon: 'user-friends', visible: true },
			{ name: 'Reports', path: '/reports_total_paid/', icon: 'file-alt', visible: true },
			{ name: 'Overdue', path: '/overdue/', icon: 'stopwatch', visible: true },
			{ name: 'Financial', secondText: 'Statement', path: '/financial_statement/', icon: 'money-check-alt', visible: true, longText: true },
			{ name: 'Ledgers', path: '/ledgers/', icon: 'book', visible: true },
			{ name: 'Accounts', path: '/accounts_payable/', icon: 'file-contract', visible: true },
		]
		return (
			<div className="sidebar-wrap">
				<div className="sidebar" id="sideBar">
					<ul>
						<li className="logo-li">
							<FontAwesomeIcon className="dismiss-sidebar" icon="times" onClick={this.closeSidebar} />
							<Link to='/accounting/'>
								<img src={EversureLogo} alt="logo" className="logo" />
							</Link>
						</li>
						<li className="system-type">
							<ButtonDropdown isOpen={isOpen} toggle={this.toggle}>
					      <DropdownToggle caret>
					        Accounting System
					      </DropdownToggle>
					      <DropdownMenu>
					        <DropdownItem>
					        	<Link to="/">Inventory System</Link>
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
								return link.visible ? link.longText ? 
											<li key={key} className={this.props.component == link.name ? "nav-link active" : "nav-link"}>
												<Link to={link.path}><FontAwesomeIcon className="link-icon" icon={link.icon} /><span>{link.name}</span> <span className="secondText">{link.secondText}</span></Link>
											</li> : 
											<li key={key} className={this.props.component == link.name ? "nav-link active" : "nav-link"}>
												<Link to={link.path}><FontAwesomeIcon className="link-icon" icon={link.icon} />{link.name}</Link>
											</li> : null
							})
						}
						<li className="app-version" id="appVersion">
							<span>Eversure {MY_APP.version}</span>
						</li>
					</ul>
				</div>
			</div>
		);
	}
}

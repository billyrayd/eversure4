import React from 'react';
import { Link } from 'react-router-dom';

//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as AuthActions from 'actions/auth';

import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { MY_APP } from 'helpers';

import EversureLogo from 'assets/logo/eversure_logo.png';

var $ = require( 'jquery' );

var ps;

class InventorySidebar extends React.PureComponent {

	constructor(props) {
		super(props);
    this.sideBar = React.createRef();

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
		if(this.props.authenticated){
    	window.addEventListener("resize", this.showSidebar.bind(this));
		}
	}
	toggle = () => {
		let { isOpen } = this.state;

		this.setState({isOpen: !isOpen});
	}
	showSidebar = () => {
		if(window.innerWidth > 415){
			document.getElementById("sideBar").style.width = "200px";
    	document.getElementById("appVersion").style.bottom = "0px";
			$(".table").css({width: '100%'});
		}else{
			document.getElementById("sideBar").style.width = "0px";
    	document.getElementById("appVersion").style.bottom = "-55px";
		}
	}
	closeSidebar = () => {
		// $(".sidebar").toggle();

    document.getElementById("sideBar").style.width = "0px";
    document.getElementById("appVersion").style.bottom = "-55px";
		$(".sidebar-wrap").removeClass("es-overlay");
    // document.body.classList.toggle("disable-scroll");
    $("body").removeClass("disable-scroll");
		
	}
	goTo = (path) =>{
		this.props.history.push(path);
	}

	render() {
		let { isOpen } = this.state;
		let links = [
			{ name: 'Dashboard', path: '/dashboard/', icon: 'tachometer-alt', visible: true },
			{ name: 'Inventory', path: '/brand_new_in_stock/', icon: 'list', visible: true },
			{ name: 'Payments', path: '/payments/', icon: 'money-bill', visible: true },
			{ name: 'Reports', path: '/unsold_units/', icon: 'file-alt', visible: true },
			{ name: 'Users', path: '/users/', icon: 'users', visible: true },
			{ name: 'Settings', path: '/branches/', icon: 'cogs', visible: true },
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
					        Inventory
					      </DropdownToggle>
					      <DropdownMenu>
					        <DropdownItem onClick={() => this.goTo("/accounting/")}>
					        	<span>Sales</span>
					        </DropdownItem>
					        <DropdownItem divider />
					        <DropdownItem onClick={() => this.goTo("/old_records/")}>
					        	<span>Old Records</span>
					        </DropdownItem>
					      </DropdownMenu>
					    </ButtonDropdown>
						</li>
						{
							links.map((link, key) => {
								return link.visible ? <li key={key} className={this.props.component == link.name ? "nav-link active" : "nav-link"} onClick={() => this.goTo(link.path)}>
												<span className="link-name"><FontAwesomeIcon className="link-icon" icon={link.icon} />{link.name}</span>
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

const mapStateToProps = state => ({
  authenticated: state.user_auth.authenticated,
  loggingIn: state.user_auth.loggingIn,
  loggingOut: state.user_auth.loggingOut,
});

function mapDispatchToProps(dispatch) {
   return { actions: bindActionCreators(Object.assign({}, AuthActions), dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(InventorySidebar);

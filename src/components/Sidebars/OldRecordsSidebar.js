import React from 'react';
import { Link } from 'react-router-dom';

import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { MY_APP } from 'helpers';

import EversureLogo from 'assets/logo/eversure_logo.png';

var $ = require( 'jquery' );

export default class OldRecordsSidebar extends React.PureComponent {

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
    window.addEventListener("resize", this.showSidebar.bind(this));
	}
	toggle = () => {
		let { isOpen } = this.state;

		this.setState({isOpen: !isOpen})
	}
	showSidebar = () => {
		if(window.innerWidth > 415){
			$("#sideBar").css({width: '200px'});
			$("#appVersion").css({bottom: '0px'});
			$(".table").css({width: '100%'});
		}else{
			$("#sideBar").css({width: '0px'});
			$("#appVersion").css({bottom: '-55px'});
		}
	}
	closeSidebar = () => {
		$("#sideBar").css({width: '0px'});
		$("#appVersion").css({bottom: '-55px'});
		$(".sidebar-wrap").removeClass("es-overlay");
    document.body.classList.toggle("disable-scroll");
	}
	goTo = (path) =>{
		this.props.history.push(path);
	}

	render() {
		let { isOpen } = this.state;
		let links = [
			{ name: 'Customers', path: '/old_records/', icon: 'user-friends', visible: true, title: 'Landing' },
		]
		return (
			<div className="sidebar-wrap">
				<div className="sidebar" id="sideBar">
					<ul>
						<li className="logo-li">
							<FontAwesomeIcon className="dismiss-sidebar" icon="times" onClick={this.closeSidebar} />
							<Link to='/old_records/'>
								<img src={EversureLogo} alt="logo" className="logo" />
							</Link>
						</li>
						<li className="system-type">
							<ButtonDropdown isOpen={isOpen} toggle={this.toggle}>
					      <DropdownToggle caret>
					        Old Records
					      </DropdownToggle>
					      <DropdownMenu>
					        <DropdownItem onClick={() => this.goTo("/")}>
					        	<span>Inventory</span>
					        </DropdownItem>
					        <DropdownItem divider />
					        <DropdownItem onClick={() => this.goTo("/accounting/")}>
					        	<span>Sales</span>
					        </DropdownItem>
					      </DropdownMenu>
					    </ButtonDropdown>
						</li>
						{
							links.map((link, key) => {
								return link.visible ? link.longText ? 
											<li key={key} className={this.props.component == link.title ? "nav-link active" : "nav-link"}>
												<span className="link-name"><FontAwesomeIcon className="link-icon" icon={link.icon} /><span>{link.name}</span> <span className="secondText">{link.secondText}</span></span>
											</li> : 
											<li key={key} className={this.props.component == link.title ? "nav-link active" : "nav-link"}>
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

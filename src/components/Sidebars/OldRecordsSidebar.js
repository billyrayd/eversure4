import React from 'react';
import { Link } from 'react-router-dom';

import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import EversureLogo from 'assets/logo/eversure_logo.png';

var $ = require( 'jquery' );

export default class OldRecordsSidebar extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			isOpen: false
		}
	}

	toggle = () => {
		let { isOpen } = this.state;

		this.setState({isOpen: !isOpen})
	}

	closeSidebar = () => {
		$(".sidebar").toggle();
	}

	render() {
		let { isOpen } = this.state;
		let links = [
			{ name: 'Customers', path: '/old_records/', icon: 'user-friends', visible: true, title: 'Landing' },
		]
		return (
			<div className="sidebar">
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
				        Old Records System
				      </DropdownToggle>
				      <DropdownMenu>
				        <DropdownItem>
				        	<Link to="/">Inventory System</Link>
				        </DropdownItem>
				        <DropdownItem divider />
				        <DropdownItem>
				        	<Link to="/accounting/">Accounting System</Link>
				        </DropdownItem>
				      </DropdownMenu>
				    </ButtonDropdown>
					</li>
					{
						links.map((link, key) => {
							return link.visible ? link.longText ? 
										<li key={key} className={this.props.component == link.title ? "nav-link active" : "nav-link"}>
											<Link to={link.path}><FontAwesomeIcon className="link-icon" icon={link.icon} /><span>{link.name}</span> <span className="secondText">{link.secondText}</span></Link>
										</li> : 
										<li key={key} className={this.props.component == link.title ? "nav-link active" : "nav-link"}>
											<Link to={link.path}><FontAwesomeIcon className="link-icon" icon={link.icon} />{link.name}</Link>
										</li> : null
						})
					}
					<li className="app-version">
						<span>Eversure v4.0.0</span>
					</li>
				</ul>
			</div>
		);
	}
}

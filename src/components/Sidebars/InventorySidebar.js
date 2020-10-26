import React from 'react';
import { Link } from 'react-router-dom';

import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import EversureLogo from 'assets/logo/eversure_logo.png';

export default class InventorySidebar extends React.PureComponent {

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
			<div className="sidebar">
				<ul>
					<li className="logo-li">
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
					<li className="app-version">
						<span>Eversure v4.0.0</span>
					</li>
				</ul>
			</div>
		);
	}
}

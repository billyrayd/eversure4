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
			{ name: 'Dashboard', path: '/dashboard/', icon: 'home' },
			{ name: 'Inventory', path: '/inventory/', icon: 'list' },
			{ name: 'Payments', path: '/payments/', icon: 'money-bill' },
			{ name: 'Reports', path: '/reports/', icon: 'chart-line' },
			{ name: 'Users', path: '/users/', icon: 'users' },
			{ name: 'Settings', path: '/settings/', icon: 'cogs' },
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
				        <DropdownItem>Old Records System</DropdownItem>
				        <DropdownItem divider />
				        <DropdownItem>Accounting System</DropdownItem>
				      </DropdownMenu>
				    </ButtonDropdown>
					</li>
					{
						links.map((link, key) => {
							return <li key={key} className={this.props.component == link.name ? "nav-link active" : "nav-link"}>
											<Link to={link.path}><FontAwesomeIcon className="link-icon" icon={link.icon} />{link.name}</Link>
										</li>
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

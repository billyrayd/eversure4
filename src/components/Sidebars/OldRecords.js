import React from 'react';
import { Link } from 'react-router-dom';

import EversureLogo from 'assets/logo/eversure_logo.png'

export default class OldRecordsSidebar extends React.PureComponent {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="sidebar">
				<ul>
					<li className="logo-li">
						<Link to='/'>
							<img src={EversureLogo} alt="logo" className="logo" />
						</Link>
					</li>
					<li>
						<Link to='/dashboard/'>
							Dashboard
						</Link>
					</li>
					<li>
						<Link to='/inventory/'>
							Inventory
						</Link>
					</li>
					<li>
						<Link to='/reports/'>
							Reports
						</Link>
					</li>
				</ul>
			</div>
		);
	}
}

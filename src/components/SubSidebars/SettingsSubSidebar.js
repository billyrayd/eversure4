import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from 'reactstrap';

export default class SettingsSubSidebar extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
		}
	}

	goTo = (path) => {
		this.props.history.push(path);
	}

	render() {
		let sublinks = [
			{ name: 'Branches', path: '/branches/', visible: true },
			{ name: 'Brands', path: '/brands/', visible: true },
			{ name: 'Models', path: '/models/', visible: true },
			// { name: 'User Roles', path: '/user_roles/', visible: true },
			{ name: 'Customer Area', path: '/customer_area/', visible: true },
		]
		return (
			<div className="sub-sidebar">
				<ul>
					<li className="page-title">
						<span>Settings</span>
					</li>
					{
						/*
							<li className="add-btn-wrap">
								<Button className="ss-add-btn" color="warning" block>ADD</Button>
							</li>
						*/
					}
					{
						sublinks.map((link, key) => {
							const className = link.nonLink ? link.className : (this.props.subpage == link.path ? "nav-link active" : "nav-link");

							return link.visible ? <li key={key} className={className} onClick={() => this.goTo(link.path)}><span className="link-name">{link.className == "divider" ? '' : link.name}</span></li> : null
						})
					}
				</ul>
			</div>
		);
	}
}

import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from 'reactstrap';

export default class ReportsSubSidebar extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
		}
	}

	render() {
		let sublinks = [
			{ name: 'Unsold', path: '/brand_new_unsold/', visible: true },
			{ name: 'Sold', path: '/brand_new_sold/', visible: true },
			{ name: 'No Clearance', path: '/transfer/', visible: true },
			{ name: 'No TBA\'s', path: '/outgoing/', visible: true },
			{ name: 'Warranty Claims', path: '/incoming/', visible: true },
			{ name: 'Total (Unsold)', path: '/incoming/', visible: true },
			{ name: 'Total (Sold)', path: '/incoming/', visible: true },
			{ name: 'Cash and Installments', path: '/incoming/', visible: true },
			{ name: 'For BIR', path: '/incoming/', visible: true },
		]
		return (
			<div className="sub-sidebar">
				<ul>
					<li className="page-title">
						<span>Reports</span>
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

							return link.visible ? <li key={key} className={className}><Link to={link.path}>{link.className == "divider" ? '' : link.name}</Link></li> : null
						})
					}
				</ul>
			</div>
		);
	}
}
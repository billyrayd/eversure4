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
			{ name: 'Unsold', path: '/unsold_units/', visible: true },
			{ name: 'Sold', path: '/sold_units/', visible: true },
			{ name: 'No Clearance', path: '/no_clearance/', visible: true },
			{ name: 'No TBA\'s', path: '/no_tba/', visible: true },
			{ name: 'Warranty Claims', path: '/warranty_claims/', visible: true },
			{ name: 'Total (Unsold)', path: '/total_unsold/', visible: true },
			{ name: 'Total (Sold)', path: '/total_sold/', visible: true },
			{ name: 'Cash and Installments', path: '/cash_and_installments/', visible: true },
			{ name: 'For BIR', path: '/bir/', visible: true },
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
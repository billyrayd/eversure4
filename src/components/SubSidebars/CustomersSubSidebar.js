import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from 'reactstrap';

export default class CustomersSubSidebar extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
		}
	}

	render() {
		let sublinks = [
			{ name: 'Brand New', path: '/', visible: true, className: "nav-link-header", nonLink: true },
			{ name: 'Installment', path: '/brandnew_customer_installment/', visible: true },
			{ name: 'Cash', path: '/brandnew_customer_cash/', visible: true },
			{ name: 'Fully Paid', path: '/brandnew_customer_fully_paid/', visible: true },
			{ name: 'Repossessed', path: '/brandnew_customer_repossessed/', visible: true },
			{ name: 'divider', path: '/', visible: true, className: 'divider', nonLink: true },
			{ name: 'Secondhand', path: '/', visible: true, className: "nav-link-header", nonLink: true },
			{ name: 'Installment', path: '/secondhand_customer_installment/', visible: true },
			{ name: 'Cash', path: '/secondhand_customer_cash/', visible: true },
			{ name: 'Fully Paid', path: '/secondhand_customer_fully_paid/', visible: true },
			{ name: 'Repossessed', path: '/secondhand_customer_repossessed/', visible: true },
		]
		return (
			<div className="sub-sidebar">
				<ul>
					<li className="page-title">
						<span>Customers</span>
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
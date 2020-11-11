import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from 'reactstrap';

export default class AccReportsSubSidebar extends React.PureComponent {

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
			{ name: 'Total Paid', path: '/reports_total_paid/', visible: true },
			{ name: 'Total Current Monthly Amortization', path: '/reports_total_current_monthly_amortization/', visible: true },
			{ name: 'Account No Payment (Brand New)', path: '/reports_account_no_payment_brandnew/', visible: true },
			{ name: 'Account No Payment (Secondhand)', path: '/reports_account_no_payment_secondhand/', visible: true },
			{ name: 'Customer List Per Area', path: '/reports_customer_list_per_area/', visible: true },
			{ name: 'Customers Who Paid', path: '/reports_customers_who_paid/', visible: true },
			{ name: 'New Customers', path: '/reports_new_customers/', visible: true },
			{ name: 'Fully Paid Customers', path: '/reports_fully_paid_customers/', visible: true },
			{ name: 'Customers with Repossessed Units', path: '/reports_customers_with_repossessed_units/', visible: true },
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

							return link.visible ? <li key={key} className={className} onClick={() => this.goTo(link.path)}><span className="link-name">{link.className == "divider" ? '' : link.name}</span></li> : null
						})
					}
				</ul>
			</div>
		);
	}
}

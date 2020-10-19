import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from 'reactstrap';

export default class InventorySubSidebar extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
		}
	}

	render() {
		let sublinks = [
			{ name: 'Brand New', path: '/', visible: true, className: "nav-link-header", nonLink: true },
			{ name: 'In Stock', path: '/brand_new_in_stock/', visible: true },
			{ name: 'Sold', path: '/brand_new_sold/', visible: true },
			{ name: 'Transfer', path: '/transfer/', visible: true },
			{ name: 'Outgoing', path: '/outgoing/', visible: true },
			{ name: 'Incoming', path: '/incoming/', visible: true },
			{ name: 'divider', path: '/', visible: true, className: 'divider', nonLink: true },
			{ name: 'Secondhand', path: '/', visible: true, className: "nav-link-header", nonLink: true },
			{ name: 'In Stock', path: '/secondhand_in_stock/', visible: true },
			{ name: 'Sold', path: '/secondhand_sold/', visible: true },
			{ name: 'divider', path: '/', visible: true, className: 'divider', nonLink: true },
			{ name: 'Search D.R.', path: '/search_dr/', visible: true },
			{ name: 'Duplicate Entries', path: '/duplicate_entries/', visible: true },
		]
		return (
			<div className="sub-sidebar">
				<ul>
					<li className="page-title">
						<span>Inventory</span>
					</li>
					<li className="add-btn-wrap">
						<Button className="ss-add-btn" color="warning" block>ADD</Button>
					</li>
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

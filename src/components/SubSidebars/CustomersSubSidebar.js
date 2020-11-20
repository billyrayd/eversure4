import React from 'react';
import { Link } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as AuthActions from 'actions/auth';

import { Button } from 'reactstrap';

class CustomersSubSidebar extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
		}
	}

	goTo = (path) => {
		this.props.history.push(path);
	}

	render() {
		let { userData } = this.props;
		let { branch_name } = userData.branch_info;
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
						branch_name === 'MAIN' ? null :
							<li className="add-btn-wrap">
								<Button className="ss-add-btn" color="warning" block onClick={this.props.openModal}>ADD CUSTOMER</Button>
							</li>
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

const mapStateToProps = state => ({
  authenticated: state.user_auth.authenticated,
  loggingIn: state.user_auth.loggingIn,
  userData: state.login.userData
});

function mapDispatchToProps(dispatch) {
   return { actions: bindActionCreators(Object.assign({}, AuthActions), dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomersSubSidebar);

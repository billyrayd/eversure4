import React from 'react';
//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DashboardActions from 'actions/dashboard';
import * as AuthActions from 'actions/auth';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//reactstrap
import {
	Container,
	Row,
	Col
} from 'reactstrap';

import NavBar from 'components/Navbars/NavBar';
import AccountingSidebar from 'components/Sidebars/AccountingSidebar';

class AccountingLandingPage extends React.PureComponent {
	constructor(props) {
		super(props);
	}
	logOut = () => {
		const that = this;
		this.props.actions.Authenticate(false)
		.then((res) => {
			if(res){
				that.props.history.push("/")
			}
		})
	}
	goTo = (path) => {
		this.props.history.push(path)
	}

	render() {
		return (
			<div>
				<AccountingSidebar history={this.props.history} component="Landing" />
				<div className="content">
					<NavBar data={this.props} system="Inventory" history={this.props.history} logout={this.logOut}/>
						<Container fluid>
							<Row>
								<Col xs="12" md="10">
									<h1 className="page-title landing-page">Sales</h1>
								</Col>
							</Row>
							<Row className="landing-page">
								<Col md="12">
									<div className="space1"></div>
								</Col>
								<Col xs="12" md="4" className="landing-link" onClick={() => this.goTo("/brandnew_customer_installment/")}>
									<div className="link-wrap">
										<Col xs="6" md="12"><FontAwesomeIcon icon="user-friends" className="landing-icon" /></Col>
										<Col xs="6" md="12"><span>Customers</span></Col>
									</div>
								</Col>
								<Col xs="12" md="4" className="landing-link" onClick={() => this.goTo("/reports_total_paid/")}>
									<div className="link-wrap">
										<Col xs="6" md="12"><FontAwesomeIcon icon="file-alt" className="landing-icon" /></Col>
										<Col xs="6" md="12"><span>Reports</span></Col>
									</div>
								</Col>
								<Col xs="12" md="4" className="landing-link" onClick={() => this.goTo("/overdue/")}>
									<div className="link-wrap">
										<Col xs="6" md="12"><FontAwesomeIcon icon="stopwatch" className="landing-icon" /></Col>
										<Col xs="6" md="12"><span>Overdue</span></Col>
									</div>
								</Col>
								<Col md="12">
									<div className="space2"></div>
								</Col>
								<Col xs="12" md="4" className="landing-link" onClick={() => this.goTo("/financial_statement/")}>
									<div className="link-wrap">
										<Col xs="6" md="12"><FontAwesomeIcon icon="money-check-alt" className="landing-icon" /></Col>
										<Col xs="6" md="12"><span className="financial">Financial Statement</span></Col>
									</div>
								</Col>
								<Col xs="12" md="4" className="landing-link" onClick={() => this.goTo("/ledgers/")}>
									<div className="link-wrap">
										<Col xs="6" md="12"><FontAwesomeIcon icon="book" className="landing-icon" /></Col>
										<Col xs="6" md="12"><span>Ledgers</span></Col>
									</div>
								</Col>
								<Col xs="12" md="4" className="landing-link" onClick={() => this.goTo("/accounts_payable/")}>
									<div className="link-wrap">
										<Col xs="6" md="12"><FontAwesomeIcon icon="file-contract" className="landing-icon" /></Col>
										<Col xs="6" md="12"><span>Accounts</span></Col>
									</div>
								</Col>
							</Row>
						</Container>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
  authenticated: state.user_auth.authenticated,
  loggingIn: state.user_auth.loggingIn,
});

function mapDispatchToProps(dispatch) {
   return { actions: bindActionCreators(Object.assign({}, DashboardActions, AuthActions), dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountingLandingPage);

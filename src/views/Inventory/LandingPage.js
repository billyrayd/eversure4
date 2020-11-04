import React from 'react';
//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DashboardActions from 'actions/dashboard';
import * as AuthActions from 'actions/auth';

import { Link } from "react-router-dom";
import PerfectScrollbar from "perfect-scrollbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//reactstrap
import {
	Container,
	Row,
	Col,
	Button,
} from 'reactstrap';

import NavBar from 'components/Navbars/NavBar';
import InventorySidebar from 'components/Sidebars/InventorySidebar';

var ps;

class LandingPage extends React.PureComponent {
	constructor(props) {
		super(props);

		this.mainContent = React.createRef();
	}
	componentDidMount(){
    // ps = new PerfectScrollbar(this.mainContent.current, {
    //     suppressScrollX: true,
    //     suppressScrollY: false,
    //   });
    // document.body.classList.toggle("perfect-scrollbar-on");
	}
	logOut = () => {
		this.props.actions.Authenticate(false)
	}
	goTo = (path) => {
		this.props.history.push(path)
	}

	render() {
		return (
			<div>
				<InventorySidebar component="Landing" />
				<div className="content" ref={this.mainContent}>
						<NavBar data={this.props} system="Inventory" history={this.props.history} logout={this.logOut} />
						<Container fluid>
							<Row>
								<Col xs="12" md="10">
									<h1 className="page-title landing-page">Inventory System</h1>
								</Col>
							</Row>
							<Row className="landing-page">
								<Col md="12">
									<div className="space1"></div>
								</Col>
								<Col xs="12" md="4" className="landing-link" onClick={() => this.goTo("/dashboard/")}>
									<div className="link-wrap">
										<Col xs="6" md="12"><FontAwesomeIcon icon="tachometer-alt" className="landing-icon" /></Col>
										<Col xs="6" md="12"><span>Dashboard</span></Col>
									</div>
								</Col>
								<Col xs="12" md="4" className="landing-link" onClick={() => this.goTo("/brand_new_in_stock/")}>
									<div className="link-wrap">
										<Col xs="6" md="12"><FontAwesomeIcon icon="list" className="landing-icon" /></Col>
										<Col xs="6" md="12"><span>Inventory</span></Col>
									</div>
								</Col>
								<Col xs="12" md="4" className="landing-link" onClick={() => this.goTo("/payments/")}>
									<div className="link-wrap">
										<Col xs="6" md="12"><FontAwesomeIcon icon="money-bill" className="landing-icon" /></Col>
										<Col xs="6" md="12"><span>Payments</span></Col>
									</div>
								</Col>
								<Col md="12">
									<div className="space2"></div>
								</Col>
								<Col xs="12" md="4" className="landing-link" onClick={() => this.goTo("/brand_new_unsold/")}>
									<div className="link-wrap">
										<Col xs="6" md="12"><FontAwesomeIcon icon="file-alt" className="landing-icon" /></Col>
										<Col xs="6" md="12"><span>Reports</span></Col>
									</div>
								</Col>
								<Col xs="12" md="4" className="landing-link" onClick={() => this.goTo("/users/")}>
									<div className="link-wrap">
										<Col xs="6" md="12"><FontAwesomeIcon icon="users" className="landing-icon" /></Col>
										<Col xs="6" md="12"><span>Users</span></Col>
									</div>
								</Col>
								<Col xs="12" md="4" className="landing-link" onClick={() => this.goTo("/branches/")}>
									<div className="link-wrap">
										<Col xs="6" md="12"><FontAwesomeIcon icon="cogs" className="landing-icon" /></Col>
										<Col xs="6" md="12"><span>Settings</span></Col>
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

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);

import React from 'react';
//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DashboardActions from 'actions/dashboard';
import * as AuthActions from 'actions/auth';

import { Link } from "react-router-dom";
import PerfectScrollbar from "perfect-scrollbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import toastr from 'toastr';

//reactstrap
import {
	Container,
	Row,
	Col,
	Button,
} from 'reactstrap';

import NavBar from 'components/Navbars/NavBar';
import InventorySidebar from 'components/Sidebars/InventorySidebar';
import LoggingOut from 'components/CustomComponents/LoggingOut';

var $ = require( 'jquery' );

var ps;

class LandingPage extends React.PureComponent {
	constructor(props) {
		super(props);

		this.mainContent = React.createRef();
	}
	componentDidMount(){
	}
	logOut = () => {
		const that = this;
		$("body").addClass("disable-scroll");
		that.props.actions.LoggingOut(true);
		that.props.actions.Logout()
		.then((res) => {
			$("body").removeClass("disable-scroll");
			that.props.actions.LoggingOut(false);
			if(res){
				that.props.actions.LoginUser(false);
				that.props.history.push("/");
			}else{
				toastr.error("Failed to logout");
			}
		})
	}
	goTo = (path) => {
		this.props.history.push(path)
	}

	render() {
		let { loggingOut } = this.props;
		return (
			<div>
				<LoggingOut loggingOut={loggingOut} />
				<InventorySidebar history={this.props.history} component="Landing" authenticated={this.props.authenticated} />
				<div className="content" ref={this.mainContent}>
						<NavBar data={this.props} system="Inventory" history={this.props.history} logout={this.logOut} />
						<Container fluid>
							<Row>
								<Col xs="12" md="10">
									<h1 className="page-title landing-page">Inventory</h1>
								</Col>
							</Row>
							<Row className="landing-page">
								<Col md="12">
									<div className="space1"></div>
								</Col>
								<Col xs="12" md="4" className="landing-link">
									<div className="link-wrap" onClick={() => this.goTo("/dashboard/")}>
										<Col xs="6" md="12"><FontAwesomeIcon icon="tachometer-alt" className="landing-icon" /></Col>
										<Col xs="6" md="12"><span>Dashboard</span></Col>
									</div>
								</Col>
								<Col xs="12" md="4" className="landing-link">
									<div className="link-wrap" onClick={() => this.goTo("/brand_new_in_stock/")}>
										<Col xs="6" md="12"><FontAwesomeIcon icon="list" className="landing-icon" /></Col>
										<Col xs="6" md="12"><span>Inventory</span></Col>
									</div>
								</Col>
								<Col xs="12" md="4" className="landing-link">
									<div className="link-wrap" onClick={() => this.goTo("/payments/")}>
										<Col xs="6" md="12"><FontAwesomeIcon icon="money-bill" className="landing-icon" /></Col>
										<Col xs="6" md="12"><span>Payments</span></Col>
									</div>
								</Col>
								<Col md="12">
									<div className="space2"></div>
								</Col>
								<Col xs="12" md="4" className="landing-link">
									<div className="link-wrap" onClick={() => this.goTo("/unsold_units/")}>
										<Col xs="6" md="12"><FontAwesomeIcon icon="file-alt" className="landing-icon" /></Col>
										<Col xs="6" md="12"><span>Reports</span></Col>
									</div>
								</Col>
								<Col xs="12" md="4" className="landing-link">
									<div className="link-wrap" onClick={() => this.goTo("/users/")}>
										<Col xs="6" md="12"><FontAwesomeIcon icon="users" className="landing-icon" /></Col>
										<Col xs="6" md="12"><span>Users</span></Col>
									</div>
								</Col>
								<Col xs="12" md="4" className="landing-link">
									<div className="link-wrap" onClick={() => this.goTo("/branches/")}>
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
  loggingOut: state.user_auth.loggingOut,
});

function mapDispatchToProps(dispatch) {
   return { actions: bindActionCreators(Object.assign({}, DashboardActions, AuthActions), dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);

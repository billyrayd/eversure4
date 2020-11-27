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
	Col
} from 'reactstrap';

import NavBar from 'components/Navbars/NavBar';
import InventorySidebar from 'components/Sidebars/InventorySidebar';
import NoAccess from 'components/CustomComponents/NoAccess';
import LoggingOut from 'components/CustomComponents/LoggingOut';

var $ = require( 'jquery' );

var ps;

class Dashboard extends React.PureComponent {
	constructor(props) {
		super(props);

		this.mainContent = React.createRef();
	}
	componentDidMount(){
	}
  componentWillUnmount() {
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

	render() {
		let { loggingOut,userPermission } = this.props;
		var data = [
			{ letter: 'A' },
			{ letter: 'B' },
			{ letter: 'C' },
			{ letter: 'D' },
			{ letter: 'E' },
		];

		const permission = userPermission.length > 0 ? (userPermission[0].permissions[0].level > 0) : false;
		return (
			<div>
				<LoggingOut loggingOut={loggingOut} />
				<InventorySidebar history={this.props.history} component="Dashboard" />
				<div className="content" ref={this.mainContent}>
					<NavBar data={this.props} system="Inventory" history={this.props.history} logout={this.logOut}/>
					{
						permission ?
						<div className="main-panel">
							<Container fluid>
								<Row>
									<Col xs="6" md="9">
										<h1 className="page-title">Dashboard</h1>
									</Col>
									<Col xs="6" md="3">
										<Link to="/" className="main-link mobile"><FontAwesomeIcon icon="caret-left"/> main menu</Link>
									</Col>
									<Col>
										{
											data.map((v, i) => {
												return <div key={i} className="test">{v.letter}</div>
											})
										}
									</Col>
								</Row>
							</Container>
						</div> :
						<NoAccess />
					}
						
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
  authenticated: state.user_auth.authenticated,
  loggingIn: state.user_auth.loggingIn,
  loggingOut: state.user_auth.loggingOut,
  userPermission: state.login.userPermission,
});

function mapDispatchToProps(dispatch) {
   return { actions: bindActionCreators(Object.assign({}, DashboardActions, AuthActions), dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

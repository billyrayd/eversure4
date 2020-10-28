import React from 'react';
//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DashboardActions from 'actions/dashboard';
import * as AuthActions from 'actions/auth';

import PerfectScrollbar from "perfect-scrollbar";

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
    ps = new PerfectScrollbar(this.mainContent.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    document.body.classList.toggle("perfect-scrollbar-on");
	}

	logOut = () => {
		this.props.actions.Authenticate(false)
	}

	render() {
		return (
			<div>
				<InventorySidebar component="Landing" />
				<div className="content" ref={this.mainContent}>
						<NavBar data={this.props} system="Inventory" />
						<Container fluid>
							<Row>
								<Col>
									<h1>Inventory Landing Page</h1>
									<Button onClick={this.logOut}>
										Log Out
									</Button>
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

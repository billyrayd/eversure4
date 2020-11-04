import React from 'react';
//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DashboardActions from 'actions/dashboard';
import * as AuthActions from 'actions/auth';

import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//reactstrap
import {
	Container,
	Row,
	Col,
	Button,
	Table,
	Tooltip,
	Input,
} from 'reactstrap';

import NavBar from 'components/Navbars/NavBar';
import InventorySidebar from 'components/Sidebars/InventorySidebar';
import NoAccess from 'components/CustomComponents/NoAccess';

class Payments extends React.PureComponent {
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

	render() {
		const permission = true;

		return (
			<div>
				<InventorySidebar component="Payments" />
				<div className="content">
					<NavBar data={this.props} system="Inventory" history={this.props.history} logout={this.logOut}/>
						{
							permission ?
							<div>
								<Container fluid>
									<Row>
										<Col xs="6" md="9">
											<h1 className="page-title">Payments</h1>
										</Col>
										<Col xs="6" md="3">
											<Link to="/" className="main-link mobile"><FontAwesomeIcon icon="caret-left"/> main menu</Link>
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
});

function mapDispatchToProps(dispatch) {
   return { actions: bindActionCreators(Object.assign({}, DashboardActions, AuthActions), dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Payments);

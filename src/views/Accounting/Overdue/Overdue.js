import React from 'react';
//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DashboardActions from 'actions/dashboard';

//reactstrap
import {
	Container,
	Row,
	Col
} from 'reactstrap';

import NavBar from 'components/Navbars/NavBar';
import AccountingSidebar from 'components/Sidebars/AccountingSidebar';
import NoAccess from 'components/CustomComponents/NoAccess';

class Overdue extends React.PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
		const permission = !true;
		return (
			<div>
				<AccountingSidebar component="Overdue" />
				<div className="content">
					<NavBar data={this.props} system="Accounting" />
					{
						permission ?
						<div>
							<Container fluid>
								<Row>
									<Col>
										<h1>Customers with Overdue Payments</h1>
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
   return { actions: bindActionCreators(Object.assign({}, DashboardActions), dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Overdue);

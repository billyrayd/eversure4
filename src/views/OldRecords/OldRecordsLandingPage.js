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
import OldRecordsSidebar from 'components/Sidebars/OldRecordsSidebar';
import LoggingOut from 'components/CustomComponents/LoggingOut';

class OldRecordsLandingPage extends React.PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
		let { loggingOut } = this.props;
		return (
			<div>
				<LoggingOut loggingOut={loggingOut} />
				<OldRecordsSidebar history={this.props.history} component="Landing" />
				<div className="content">
						<NavBar data={this.props} history={this.props.history} system="OldRecords" />
						<Container fluid>
							<Row>
								<Col>
									<h1>Old Records Landing Page</h1>
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
   return { actions: bindActionCreators(Object.assign({}, DashboardActions), dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(OldRecordsLandingPage);

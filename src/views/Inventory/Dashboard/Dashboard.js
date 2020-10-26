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
import InventorySidebar from 'components/Sidebars/InventorySidebar';
import NoAccess from 'components/CustomComponents/NoAccess';

class Dashboard extends React.PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
		var data = [
			{ letter: 'A' },
			{ letter: 'B' },
			{ letter: 'C' },
			{ letter: 'D' },
			{ letter: 'E' },
		];

		const permission = !true;
		return (
			<div>
				<InventorySidebar component="Dashboard" />
				<div className="content">
					{
						permission ?
						<div>
							<NavBar data={this.props} system="Inventory" />
							<Container fluid>
								<Row>
									<Col>
										<h1>Dashboard</h1>
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
});

function mapDispatchToProps(dispatch) {
   return { actions: bindActionCreators(Object.assign({}, DashboardActions), dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

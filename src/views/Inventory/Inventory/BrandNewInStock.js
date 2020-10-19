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
import InventorySubSidebar from 'components/SubSidebars/InventorySubSidebar';

class BrandNewInStock extends React.PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<InventorySidebar component="Inventory" />
				<div className="content">
						<NavBar data={this.props}/>
						<InventorySubSidebar subpage="/brand_new_in_stock/"/>
						<Container className="with-subsidebar" fluid>
							<Row>
								<Col>
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
   return { actions: bindActionCreators(Object.assign({}, DashboardActions), dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(BrandNewInStock);

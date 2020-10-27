import React from 'react';
//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DashboardActions from 'actions/dashboard';

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
import SettingsSubSidebar from 'components/SubSidebars/SettingsSubSidebar';
import NoAccess from 'components/CustomComponents/NoAccess';

var $ = require( 'jquery' );
$.DataTable = require('datatables.net');

class Brands extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			isOpenEdit: false,
			isOpenDelete: false,
			isOpenView: false,
			value: ''
		}
	}

	componentDidMount(){
		var mainTable = $(".users-table").DataTable({
			"sDom": '<"bottom"<t>ip><"clear">',
			initComplete: () => {
			}
		})

		$('.dt-search').keyup(function () {
      mainTable.search($(this).val()).draw();
    });
	}
	toggleEdit = () => {
		let { isOpenEdit } = this.state;
		this.setState({isOpenEdit: !isOpenEdit})
	}
	toggleDelete = () => {
		let { isOpenDelete } = this.state;
		this.setState({isOpenDelete: !isOpenDelete})
	}
	toggleView = () => {
		let { isOpenView } = this.state;
		this.setState({isOpenView: !isOpenView})
	}
	/* set input characters to uppercase */
	handleChange = (event) => {
	  const input = event.target;
	  const start = input.selectionStart;
	  const end = input.selectionEnd;
	  let uppercasedValue = input.value.toUpperCase()

	  this.setState(
	    {value: uppercasedValue},
	    () => input.setSelectionRange(start, end)
	  );
	}

	advancedFilter = () => {
		const that = this;
		let { value } = this.state;
	}

	render() {
		let { isOpenEdit, isOpenDelete, isOpenView, value } = this.state;
		const permission = true;
		return (
			<div>
				<InventorySidebar component="Settings" />
				<div className="content">
						<NavBar data={this.props} system="Inventory" />
						{
							permission ?
							<div>
								<SettingsSubSidebar subpage="/brands/"/>
								<Container className="with-subsidebar" fluid>
									<Row className="page-header">
										<Col>
											<h4>Motorcycle Brands List<Button className="es-main-btn" color="primary" size="sm"><FontAwesomeIcon className="font10" icon="plus" />  Add</Button> </h4>
										</Col>
									</Row>
									<Row className="one-input-search">
											<Col md="6"><Input className="dt-search" placeholder="Search Brands" /></Col>
									</Row>
									<Row>
										<br />
									</Row>
									<Row>
										<Col>
											<Table className="users-table">
												<thead>
													<tr>
														<th>no.</th>
														<th>brand name</th>
														<th>action</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td>1</td>
														<td>kawasaki</td>
														<td>
															<Button color="primary" size="sm" id="edit" >
																<FontAwesomeIcon icon="edit"/>
																<Tooltip target="edit" placement="top" autohide={true} isOpen={isOpenEdit} toggle={this.toggleEdit}>Edit</Tooltip>
															</Button>
															<Button color="danger" size="sm" id="delete">
																<FontAwesomeIcon icon="trash" />
																<Tooltip target="delete" placement="top" autohide={true} isOpen={isOpenDelete} toggle={this.toggleDelete}>Delete</Tooltip>
															</Button>
														</td>
													</tr>
												</tbody>
											</Table>
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

export default connect(mapStateToProps, mapDispatchToProps)(Brands);

import React from 'react';
//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DashboardActions from 'actions/dashboard';
import * as AuthActions from 'actions/auth';

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
	ListGroup,
	ListGroupItem,
	ButtonGroup,
} from 'reactstrap';

import NavBar from 'components/Navbars/NavBar';
import InventorySidebar from 'components/Sidebars/InventorySidebar';
import UsersSubSidebar from 'components/SubSidebars/UsersSubSidebar';
import NoAccess from 'components/CustomComponents/NoAccess';

var $ = require( 'jquery' );
$.DataTable = require('datatables.net');

class UsersPermissions extends React.PureComponent {
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
	logOut = () => {
		const that = this;
		this.props.actions.Authenticate(false)
		.then((res) => {
			if(res){
				that.props.history.push("/")
			}
		})
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
				<InventorySidebar component="Users" />
				<div className="content">
					<NavBar data={this.props} system="Inventory" history={this.props.history} logout={this.logOut}/>
						{
							permission ?
							<div>
								<UsersSubSidebar subpage="/user_permissions/"/>
								<Container className="with-subsidebar" fluid>
									<Row className="page-header">
										<Col>
											<h4>User Permissions</h4>
										</Col>
									</Row>
									<Row>
										<br />
									</Row>
									<Row>
										<Col md="4">
											<ListGroup>
								        <ListGroupItem tag="a" href="#" action>Administrator</ListGroupItem>
								        <ListGroupItem active tag="a" href="#" action>branch admin</ListGroupItem>
								        <ListGroupItem tag="a" href="#" action>employee</ListGroupItem>
								        <ListGroupItem tag="a" href="#" action>encoder</ListGroupItem>
								        <ListGroupItem tag="a" href="#" action>document specialist</ListGroupItem>
								      </ListGroup>
										</Col>
										<Col md="8">
											<Col md="12" className="background-white" style={{padding: 20}}> 
												<table className="table user-permissions">
													<thead>
														<tr>
															<th></th>
															<th>Full Access</th>
															<th>View Only</th>
															<th>No Access</th>
														</tr>
													</thead>
													<tbody>
														<tr>
															<td width="200" style={{fontWeight: 'bold'}}>Inventory system</td>
														</tr>
														<tr>
															<td>dashboard</td>
															<td><Button color="success"><FontAwesomeIcon icon="check" /></Button></td>
															<td><Button><FontAwesomeIcon icon="ban" /></Button></td>
															<td><Button><FontAwesomeIcon icon="ban" /></Button></td>
														</tr>
														<tr>
															<td>Inventory</td>
															<td><Button color="success"><FontAwesomeIcon icon="check" /></Button></td>
															<td><Button><FontAwesomeIcon icon="ban" /></Button></td>
															<td><Button><FontAwesomeIcon icon="ban" /></Button></td>
														</tr>
														<tr>
															<td width="200" style={{fontWeight: 'bold'}}>accounting system</td>
														</tr>
														<tr>
															<td>customers</td>
															<td><Button><FontAwesomeIcon icon="ban" /></Button></td>
															<td><Button color="success"><FontAwesomeIcon icon="check" /></Button></td>
															<td><Button><FontAwesomeIcon icon="ban" /></Button></td>
														</tr>
														<tr>
															<td width="200" style={{fontWeight: 'bold'}}>old records system</td>
														</tr>
														<tr>
															<td>customers</td>
															<td><Button><FontAwesomeIcon icon="ban" /></Button></td>
															<td><Button color="success"><FontAwesomeIcon icon="check" /></Button></td>
															<td><Button><FontAwesomeIcon icon="ban" /></Button></td>
														</tr>
													</tbody>
												</table>
												<Row>
													<Col md="12">
														<Col md="5" className="float-right">
															<Button className="es-main-btn" block>Save</Button>
														</Col>
													</Col>
												</Row>
											</Col>
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

export default connect(mapStateToProps, mapDispatchToProps)(UsersPermissions);

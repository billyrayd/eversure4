import React from 'react';
//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as AuthActions from 'actions/auth';
import * as UserActions from 'actions/prev/users';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import toastr from 'toastr';

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
import LoggingOut from 'components/CustomComponents/LoggingOut';

var $ = require( 'jquery' );
$.DataTable = require('datatables.net');

class UsersPermissions extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			value: '',
			tableData: [],
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

    this.getPermissionsList();
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
	getPermissionsList = () => {
		const that = this;

		that.props.actions.PermissionsListAssignment()
		.then((res) => {
			console.log(res.data)
			that.setState({tableData: res.data})
		})
	}

	render() {
		let { value,tableData } = this.state;
		let { loggingOut } = this.props;
		const permission = true;
		return (
			<div>
				<LoggingOut loggingOut={loggingOut} />
				<InventorySidebar history={this.props.history} component="Users" />
				<div className="content">
					<NavBar data={this.props} system="Inventory" history={this.props.history} logout={this.logOut}/>
						{
							permission ?
							<div>
								<UsersSubSidebar subpage="/user_permissions/" history={this.props.history} />
								<Container className="with-subsidebar" fluid>
									<Row className="page-header">
										<Col>
											<h4>Assign Permissions</h4>
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
												<table className="table user-permissions-list">
													<thead>
														<tr>
															<th></th>
															<th>Full Access</th>
															<th>View Only</th>
															<th>No Access</th>
														</tr>
													</thead>
													<tbody>
														{
															tableData.map((v,i) => {
																return <>
																				<tr>
																					<td width="200" style={{fontWeight: 'bold'}}>{v.system_type}</td>
																				</tr>
																				{
																					v.permissions.map((value,key) => {
																						return <tr key={key}>
																										<td>{value.page}</td>
																										<td><Button color="success"><FontAwesomeIcon icon="check" /></Button></td>
																										<td><Button><FontAwesomeIcon icon="ban" /></Button></td>
																										<td><Button><FontAwesomeIcon icon="ban" /></Button></td>
																									</tr>
																					})
																				}
																				</>
															})
														}
														{
															/*
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
															*/
														}
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
  loggingOut: state.user_auth.loggingOut,
});

function mapDispatchToProps(dispatch) {
   return { actions: bindActionCreators(Object.assign({}, AuthActions,UserActions,), dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersPermissions);

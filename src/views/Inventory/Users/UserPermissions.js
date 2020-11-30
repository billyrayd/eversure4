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
			designationList: [],
			currentPermissions: [],
			permissionNames: [],
			activeRole: 0,
			editing: false,
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

		that.props.actions.PermissionsListAssignment();

		that.props.actions.GetUserDesignationList()
		.then((res) => {
			if(res.status){
				let userPermissions =  res.data[0].length > 0 ? res.data[0].permission_info[0].permissions : [];
				that.setState({designationList: res.data, currentPermissions: userPermissions,activeRole: 0});
				that.getPermissions(res.data[0]._id,0);
			}
		})
	}
	getPermissions = (id,index) => {
		const that = this;
		that.setState({editing: false});
		that.props.actions.GetUserDesignationList(id)
		.then((res) => {
			if(res.status){
				let userPermissions =  res.data[0].permission_info.length > 0 ? res.data[0].permission_info[0].permissions : [];
				that.setState({currentPermissions: userPermissions,permissionForm: userPermissions,activeRole: index});
			}
		})
	}
	enableEditing = (data) => {
		const that = this;
		if(!data){
			that.setState({editing: true});
		}
	}
	updatePermission = (data) => {
		let { permissionForm } = this.state;
		console.log(data)
		console.log(permissionForm)
	}
	savePermissions = () => {

	}

	render() {
		let { value,designationList,currentPermissions,permissionNames,activeRole,editing,permissionForm, } = this.state;
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
												{
													designationList.length > 0 && designationList.map((v,i) => {
														let active = (i == activeRole);
														return <ListGroupItem key={i} tag="span" href="#" action active={active} onClick={() => this.getPermissions(v._id,i)}>{v.position_type}</ListGroupItem>
													})
												}
								      </ListGroup>
										</Col>
										<Col md="8">
											<Col md="12" className="background-white" style={{padding: 20, marginBottom: 20}}> 
												<Col md="12" style={{marginBottom: 50}}>
													<Col md="5" className="float-right">
														{
															editing ? 
														<div>
															<Button style={{display: 'inline-block'}} color="secondary" block onClick={() => this.setState({editing: false})}>
															Cancel
														</Button>
														<Button style={{display: 'inline-block'}} className="es-main-btn" block onClick={() => this.savePermissions()}>
															Save
														</Button>
														</div> : 
														<Button className="es-main-btn" block onClick={() => this.enableEditing(currentPermissions.length == 0)}>
															{currentPermissions.length == 0 ? "Add Default Permissions" : "Edit Permissions"}
														</Button>
														}
													</Col>
												</Col>
												<table className="table table-hover user-permissions-list">
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
															editing && permissionForm.length > 0 && permissionForm.map((v,i) => {
																return <>
																				<tr>
																					<td width="200" colSpan="4" style={{fontWeight: 'bold', textAlign: 'left'}}><h4>{v.system_type}</h4></td>
																				</tr>
																				{
																					v.permissions.map((value,key) => {
																							var FullAccessBtn = value.level == 2 ? ["success","check"] : ["secondary","ban"];
																							var ViewOnlyBtn = value.level == 1 ? ["success","check"] : ["secondary","ban"];
																							var NoAccessBtn = value.level == 0 ? ["success","check"] : ["secondary","ban"];

																							return <tr key={key}>
																											<td>{value.page}</td>
																											<td><Button color={FullAccessBtn[0]} onClick={() => this.updatePermission(value)}><FontAwesomeIcon icon={FullAccessBtn[1]} /></Button></td>
																											<td><Button color={ViewOnlyBtn[0]} onClick={() => this.updatePermission(value)}><FontAwesomeIcon icon={ViewOnlyBtn[1]} /></Button></td>
																											<td><Button color={NoAccessBtn[0]} onClick={() => this.updatePermission(value)}><FontAwesomeIcon icon={NoAccessBtn[1]} /></Button></td>
																										</tr>
																					})
																				}
																				</>
															})
														}
														{
															!editing && currentPermissions.length > 0 && currentPermissions.map((v,i) => {
																return <>
																				<tr>
																					<td width="200" colSpan="4" style={{fontWeight: 'bold', textAlign: 'left'}}><h4>{v.system_type}</h4></td>
																				</tr>
																				{
																					v.permissions.map((value,key) => {
																							var FullAccessBtn = value.level == 2 ? ["success","check"] : ["secondary","ban"];
																							var ViewOnlyBtn = value.level == 1 ? ["success","check"] : ["secondary","ban"];
																							var NoAccessBtn = value.level == 0 ? ["success","check"] : ["secondary","ban"];

																							return <tr key={key}>
																											<td>{value.page}</td>
																											<td><FontAwesomeIcon icon={FullAccessBtn[1]} /></td>
																											<td><FontAwesomeIcon icon={ViewOnlyBtn[1]} /></td>
																											<td><FontAwesomeIcon icon={NoAccessBtn[1]} /></td>
																										</tr>
																					})
																				}
																				</>
															})
														}
														<tr>
															<td></td>
														</tr>
													</tbody>
												</table>
												<Row>
													<Col md="12" style={{display: currentPermissions.length == 0 ? "none" : ""}}>
														<Col md="5" className="float-right">
															<Button className="es-main-btn" block onClick={() => this.enableEditing(currentPermissions.length == 0)}>
																{currentPermissions.length == 0 ? "Add Default Permissions" : "Edit Permissions"}
															</Button>
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
  designationList: state.users.designationList,
});

function mapDispatchToProps(dispatch) {
   return { actions: bindActionCreators(Object.assign({}, AuthActions,UserActions,), dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersPermissions);

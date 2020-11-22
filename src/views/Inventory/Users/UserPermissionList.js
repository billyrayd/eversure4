import React from 'react';
import ReactDOM from 'react-dom';
//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as AuthActions from 'actions/auth';
import * as UserActions from 'actions/prev/users';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
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
	ButtonDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
} from 'reactstrap';

import NavBar from 'components/Navbars/NavBar';
import InventorySidebar from 'components/Sidebars/InventorySidebar';
import UsersSubSidebar from 'components/SubSidebars/UsersSubSidebar';
import NoAccess from 'components/CustomComponents/NoAccess';
import LoggingOut from 'components/CustomComponents/LoggingOut';
import AddPermission from './Modals/AddPermission';
import EditPermission from './Modals/EditPermission';
import DeletePermission from './Modals/DeletePermission';

import { users_sub_links } from 'helpers/sublinks/Inventory';

var $ = require( 'jquery' );
$.DataTable = require('datatables.net');

const mainTableClass = ".permission-list-table";
const mainTableClassName = "permission-list-table";

class UserPermissionList extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			isOpenEdit: false,
			isOpenDelete: false,
			isOpenView: false,
			value: '',
			isOpen: false,
			permissionVal: '',
		}
	}

	componentDidMount(){
		const that = this;
		var mainTable = $(mainTableClass).DataTable({
			data: [],
			"sDom": '<"bottom"<t>ip><"clear">',
			"columnDefs": [
				{
					"targets": 0,
					"visible": false,
				},
				{
					"targets": 1,
					"width": 20,
				},
				{
					"targets": 3,
					"width": 250,
				},
				{
					"orderable": false,
					"targets": 6,
					"width": 100
				}
			],
      "columns": [
          {title: "DATA OBJECT"},
          {title: "no."},
          {title: "system type"},
          {title: "page"},
          {title: "permission group name", className: "txt-transform-i"},
          {title: "permission name", className: "txt-transform-i"},
          {title: "action", createdCell: (td, cellData, rowData, row, col) => {
						ReactDOM.render(<div>
										<Button color="primary" size="sm" className="edit">
											Edit
										</Button>
										<Button color="danger" size="sm" className="delete">
											Delete
										</Button>
									</div>, td)
          }},
      ],
			initComplete: () => {
			}
		})

		$('.dt-search').keyup(function () {
      mainTable.search($(this).val()).draw();
    });

    $(mainTableClass).on("click",".delete", function(){
    	const data = mainTable.row($(this).parents('tr')).data();
    	const id = data[0];
    	const permissionName = data[5];

    	that.setState({permissionVal: [id,permissionName]});
    	that.showModal("delete", true);
    });

    $(mainTableClass).on("click",".edit", function(){
    	const data = mainTable.row($(this).parents('tr')).data();
    	const id = data[0];
    	const systemType = data[2];
    	const permissionPage = data[3];
    	const permissionGroupName = data[4];
    	const permissionName = data[5];

    	that.setState({permissionVal: [id,permissionGroupName,permissionName,permissionPage,systemType]});
    	that.showModal("edit", true);
    });

    this.loadPermissionsList();
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
	loadPermissionsList = () => {
		const that = this;

		that.props.actions.GetPermissionsList()
		.then((res) => {
			if(res.status){
				that.reDrawDataTable(res.data);
			}
		})
	}
	reDrawDataTable = (data) => {
	  const table = $(mainTableClass).DataTable();
	  table.clear();
	  table.rows.add(data);
	  table.draw();
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
	showModal = (type, status) => {
		const that = this;
		switch(type){
			case 'add':
			that.setState({permissionAddMdlIsOpen: status}); break;
			case 'edit':
			that.setState({permissionEditMdlIsOpen: status}); break;
			case 'delete':
			that.setState({permissionDeleteMdlIsOpen: status}); break;
			default: return false;
		}
	}
	modalCallback = () => {
		this.loadPermissionsList();
	}
	opened = () => {
		$(".modal #delete").focus();
	}

	render() {
		let { isOpenEdit,isOpenDelete,isOpenView,value,isOpen,permissionAddMdlIsOpen,permissionEditMdlIsOpen,permissionDeleteMdlIsOpen,permissionVal, } = this.state;
		let { loggingOut,userData, } = this.props;
		// const permission = userData.username === 'stratium';
		const permission = true;
		const currentPage = ["Permission List","/user_permission_list/"];
		return (
			<div>
				<LoggingOut loggingOut={loggingOut} />
				<AddPermission
					modal={permissionAddMdlIsOpen}
					className="es-modal"
					callBack={this.modalCallback}
					closeModal={() => this.showModal('add',false)}
					toggle={() => this.showModal('add',false)}
				/>
				<EditPermission
					modal={permissionEditMdlIsOpen}
					className="es-modal"
					callBack={this.modalCallback}
					closeModal={() => this.showModal('edit',false)}
					toggle={() => this.showModal('edit',false)}
					data={permissionVal}
				/>
				<DeletePermission
					modal={permissionDeleteMdlIsOpen}
					className="es-modal"
					callBack={this.modalCallback}
					closeModal={() => this.showModal('delete',false)}
					data={permissionVal}
					onOpened={this.opened}
					toggle={() => this.showModal('delete',false)}
				/>
				<InventorySidebar history={this.props.history} component="Users" />
				<div className="content">
					<NavBar data={this.props} system="Inventory" history={this.props.history} logout={this.logOut}/>
						{
							permission ?
							<div>
								<UsersSubSidebar subpage={currentPage[1]} history={this.props.history} />
								<Container className="with-subsidebar" fluid>
									<Row>
										<Col xs="6">
											<h1 className="page-title inner">Settings</h1>
										</Col>
										<Col xs="6" md="3">
											<Link to="/" className="main-link mobile"><FontAwesomeIcon icon="caret-left"/> main menu</Link>
										</Col>
									</Row>
									<Row className="mobile-subsidebar">
										<Col md="12">
											<ButtonDropdown isOpen={isOpen} toggle={this.toggleSubSidebar}>
									      <DropdownToggle caret>
									        {currentPage[0]}
									      </DropdownToggle>
									      <DropdownMenu>
									      	{
									      		users_sub_links.map((link, key) => {
															const className = link.nonLink ? link.className : (currentPage[1] == link.path ? "active" : "");

									      			return link.visible ? <DropdownItem className={className} key={key} onClick={() => link.nonLink ? null : this.props.history.push(link.path)}>
									      				{link.divider ? <hr /> : link.name}
									      			</DropdownItem> : null
									      		})
									      	}
									      </DropdownMenu>
									    </ButtonDropdown>
										</Col>
										<Col md="12">
											<div className="space20" />
										</Col>
									</Row>
									<Row className="page-header">
										<Col>
											<h4>Permission List <Button className="es-main-btn" color="primary" size="sm" onClick={() => this.showModal("add",true)}><FontAwesomeIcon className="font10" icon="plus" />  Add</Button></h4>
										</Col>
									</Row>
									<Row>
										<br />
									</Row>
									<Row>
										<Col>
											<Table className={mainTableClassName} />
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
  userData: state.login.userData,
});

function mapDispatchToProps(dispatch) {
   return { actions: bindActionCreators(Object.assign({}, AuthActions,UserActions,), dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPermissionList);

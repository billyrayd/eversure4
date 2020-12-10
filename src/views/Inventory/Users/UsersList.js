import React from 'react';
import ReactDOM from 'react-dom';
//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DashboardActions from 'actions/dashboard';
import * as AuthActions from 'actions/auth';
import * as UsersActions from 'actions/prev/users';

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
} from 'reactstrap';

import { _currency } from 'helpers/';

import NavBar from 'components/Navbars/NavBar';
import InventorySidebar from 'components/Sidebars/InventorySidebar';
import UsersSubSidebar from 'components/SubSidebars/UsersSubSidebar';
import NoAccess from 'components/CustomComponents/NoAccess';
import LoggingOut from 'components/CustomComponents/LoggingOut';
import AddUser from './Modals/AddUser';
import DeleteUser from './Modals/DeleteUser';

var $ = require( 'jquery' );
$.DataTable = require('datatables.net');

const mainTableClass = ".users-table";
const mainTableClassName = "users-table";

var mainTable;

class UsersList extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			value: '',
			dtSearch: '',
			userAddMdlIsOpen: false,
			userEditMdlIsOpen: false,
			userDeleteMdlIsOpen: false,
			user: [],
		}
	}

	componentDidMount(){
		const that = this;
		mainTable = $(".users-table").DataTable({
			data: [],
			"sDom": '<"bottom"<t>ip><"clear">',
			"columnDefs": [
				{
					"targets": 0,
					"visible": false,
				},
				{
					"targets": 1,
					"width": 200,
				},
				{
					"targets": 2,
					"width": 100,
					"className": "txt-transform-i"
				},
				{
					"orderable": false,
					"targets": 5,
					"width": 150
				}
			],
      "columns": [
          {title: "DATA OBJECT"},
          {title: "name"},
          {title: "username"},
          {title: "role"},
          {title: "branch"},
          {title: "action", createdCell: (td, cellData, rowData, row, col) => {
						ReactDOM.render(<div>
										<Button color="warning" size="sm" className="view">
											View
										</Button>
										<Button color="primary" size="sm" className="edit">
											Edit
										</Button>
										<Button color="danger" size="sm" className="delete">
											Delete
										</Button>
									</div>, td)
          }},
      ],
		});

    $(mainTableClass).on("click",".delete", function(){
    	const data = mainTable.row($(this).parents('tr')).data();
    	const userId = data[0]._id;
    	const userFullName = data[1];
    	const userUsername = data[2];

    	that.setState({user: [userId,userFullName,userUsername]});
    	that.showModal("delete", true);
    });

		// $('.dt-search').keyup(function (event) {
  //     // mainTable.search($(this).val()).draw();
		//   const input = event.target;
		//   const start = input.selectionStart;
		//   const end = input.selectionEnd;
		//   let uppercasedValue = input.value.toUpperCase()

		//   that.setState(
		//     {dtSearch: uppercasedValue},
		//     () => input.setSelectionRange(start, end)
		//   );

  //     mainTable.search(uppercasedValue).draw();
  //   });

    that.getUsers();
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
	searchDtTable = (event) => {
	  const input = event.target;
	  const start = input.selectionStart;
	  const end = input.selectionEnd;
	  let uppercasedValue = input.value.toUpperCase()

	  this.setState(
	    {dtSearch: uppercasedValue},
	    () => input.setSelectionRange(start, end)
	  );

	  mainTable.search(uppercasedValue).draw();
	}
	getUsers = () => {
		const that = this;
		that.props.actions.GetAllUsers()
		.then((res) => {
			if(res){
				that.reDrawDataTable(res);
			}
		})
	}
	reDrawDataTable = (data) => {
	  const table = $(mainTableClass).DataTable();
	  table.clear();
	  table.rows.add(data);
	  table.draw();
	}
	advancedFilter = () => {
		const that = this;
		let { value } = this.state;
	}
	showModal = (action,status) => {
		const that = this;
		switch(action){
			case 'add':
			that.setState({userAddMdlIsOpen: status}); break;
			case 'edit':
			that.setState({userEditMdlIsOpen: status}); break;
			case 'delete':
			that.setState({userDeleteMdlIsOpen: status}); break;

			default: return false;
		}
	}
	openModal = () => {
		this.setState({userAddMdlIsOpen: true});
	}
	modalCallback = () => {
		this.getUsers();
	}

	render() {
		let { value,dtSearch,userAddMdlIsOpen,userEditMdlIsOpen,userDeleteMdlIsOpen,user, } = this.state;
		let { loggingOut } = this.props;
		const permission = true;
		return (
			<div>
				<LoggingOut loggingOut={loggingOut} />
				<InventorySidebar history={this.props.history} component="Users" />
				<AddUser
					modal={userAddMdlIsOpen}
					className="es-modal"
					callBack={this.modalCallback}
					closeModal={() => this.showModal('add', false)}
				/>
				<DeleteUser
					modal={userDeleteMdlIsOpen}
					className="es-modal"
					callBack={this.modalCallback}
					closeModal={() => this.showModal('delete', false)}
					toggle={() => this.showModal('delete', false)}
					data={user}
				/>
				<div className="content">
					<NavBar data={this.props} system="Inventory" history={this.props.history} logout={this.logOut}/>
						{
							permission ?
							<div>
								<UsersSubSidebar subpage="/users/" history={this.props.history} />
								<Container className="with-subsidebar" fluid>
									<Row className="page-header">
										<Col>
											<h4>System Users List<Button className="es-main-btn" color="primary" size="sm" onClick={this.openModal}><FontAwesomeIcon className="font10" icon="plus" />  Add</Button> </h4>
										</Col>
									</Row>
									<Row className="one-input-search">
											<Col md="6"><Input className="dt-search" placeholder="Search Users" value={dtSearch} onChange={(e) => this.searchDtTable(e)} /></Col>
									</Row>
									<Row>
										<br />
									</Row>
									<Row>
										<Col>
											<Table className="users-table" />
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
   return { actions: bindActionCreators(Object.assign({}, DashboardActions, AuthActions, UsersActions), dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersList);

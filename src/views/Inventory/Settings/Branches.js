import React from 'react';
import ReactDOM from 'react-dom';
//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as AuthActions from 'actions/auth';
import * as CategoryActions from 'actions/prev/category';

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
	ButtonDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
} from 'reactstrap';

import { settings_sub_links } from 'helpers/sublinks/Inventory/';

import NavBar from 'components/Navbars/NavBar';
import InventorySidebar from 'components/Sidebars/InventorySidebar';
import SettingsSubSidebar from 'components/SubSidebars/SettingsSubSidebar';
import NoAccess from 'components/CustomComponents/NoAccess';
import LoggingOut from 'components/CustomComponents/LoggingOut';
import AddBranch from './Modals/AddBranch';
import EditBranch from './Modals/EditBranch';
import DeleteBranch from './Modals/DeleteBranch';

var $ = require( 'jquery' );
$.DataTable = require('datatables.net');

const mainTableClass = ".branches-table";
const mainTableClassName = "branches-table";

class Branches extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			isOpenEdit: false,
			isOpenDelete: false,
			isOpenView: false,
			value: '',
			isOpen: false,
			branchAddMdlIsOpen: false,
			branch: '',
		}
	}

	componentDidMount(){
		const that = this;
		let { branchList } = this.props;
		var mainTable = $(mainTableClass).DataTable({
			data: branchList,
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
					"orderable": false,
					"targets": 3,
					"width": 100
				}
			],
      "columns": [
          {title: "DATA OBJECT"},
          {title: "no."},
          {title: "branch name"},
          {title: "action", createdCell: (td, cellData, rowData, row, col) => {
						ReactDOM.render(rowData[2] == "MAIN" ? null : <div>
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
    	const branchId = data[0];
    	const branchName = data[2];

    	that.setState({branch: [branchId,branchName]});
    	that.showModal("delete", true);
    });

    $(mainTableClass).on("click",".edit", function(){
    	const data = mainTable.row($(this).parents('tr')).data();
    	const branchId = data[0];
    	const branchName = data[2];

    	that.setState({branch: [branchId,branchName]});
    	that.showModal("edit", true);
    });

    that.loadBranches();
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
	loadBranches = () => {
		const that = this;
		let { branchList } = this.props;

		that.props.actions.GetAllBranches()
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
	toggleSubSidebar = () => {
		let { isOpen } = this.state;

		this.setState({isOpen: !isOpen})
	}
	showModal = (type, status) => {
		const that = this;
		switch(type){
			case 'add':
			that.setState({branchAddMdlIsOpen: status}); break;
			case 'edit':
			that.setState({branchEditMdlIsOpen: status}); break;
			case 'delete':
			that.setState({branchDeleteMdlIsOpen: status}); break;
			default: return false;
		}
	}
	modalCallback = () => {
		this.loadBranches();
	}
	toggle = (type) => {
		const that = this;
		let { branchAddMdlIsOpen,branchEditMdlIsOpen,branchDeleteMdlIsOpen } = this.state;

		switch(type){
			case 'add':
				that.setState({branchAddMdlIsOpen: !branchAddMdlIsOpen}); break;
			case 'edit':
				that.setState({branchEditMdlIsOpen: !branchEditMdlIsOpen}); break;
			case 'delete':
				that.setState({branchDeleteMdlIsOpen: !branchDeleteMdlIsOpen}); break;
			default: return false;
		}
	}
	opened = () => {
		$(".modal #delete").focus();
	}

	render() {
		let { value, isOpen, branchAddMdlIsOpen,branchDeleteMdlIsOpen,branchEditMdlIsOpen,branch } = this.state;
		let { actions,loggingOut, } = this.props;
		const permission = true;

		const currentPage = ["Branches","/branches/"];
		return (
			<div>
				<LoggingOut loggingOut={loggingOut} />
				<InventorySidebar history={this.props.history} component="Settings" />
				<AddBranch
					modal={branchAddMdlIsOpen}
					className="es-modal"
					callBack={this.modalCallback}
					closeModal={() => this.showModal('add', false)}
					actions={actions}
					toggle={() => this.toggle("add")}
					/>
				<EditBranch
					modal={branchEditMdlIsOpen}
					className="es-modal"
					callBack={this.modalCallback}
					closeModal={() => this.showModal('edit', false)}
					actions={actions}
					data={branch}
					toggle={() => this.toggle("edit")}
				/>
				<DeleteBranch
					modal={branchDeleteMdlIsOpen}
					className="es-modal"
					callBack={this.modalCallback}
					closeModal={() => this.showModal('delete', false)}
					actions={actions}
					data={branch}
					toggle={() => this.toggle("delete")}
					onOpened={() => this.opened()}
				/>
				<div className="content">
					<NavBar data={this.props} system="Inventory" history={this.props.history} logout={this.logOut}/>
						{
							permission ?
							<div>
								<SettingsSubSidebar subpage="/branches/" history={this.props.history} />
								<Container className="with-subsidebar" fluid>
									<Row>
										<Col xs="6">
											<h1 className="page-title inner">Settings</h1>
										</Col>
										<Col xs="6" md="3">
											<Link to="/" className="main-link mobile"><FontAwesomeIcon icon="caret-left"/> main menu</Link>
										</Col>
									</Row>
									<Row>
										<Col>
											<div className="space" />
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
									      		settings_sub_links.map((link, key) => {
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
											<h4>Branch List<Button className="es-main-btn" color="primary" size="sm" onClick={() => this.showModal("add", true)}><FontAwesomeIcon className="font10" icon="plus" />  Add</Button> </h4>
										</Col>
									</Row>
									<Row className="one-input-search">
											<Col md="6"><Input className="dt-search" placeholder="Search Branch" /></Col>
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
  branchList: state.category.branchesList,
  loggingOut: state.user_auth.loggingOut,
});

function mapDispatchToProps(dispatch) {
   return { actions: bindActionCreators(Object.assign({}, AuthActions, CategoryActions), dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Branches);

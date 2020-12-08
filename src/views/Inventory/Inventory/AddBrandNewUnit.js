import React from 'react';
import ReactDOM from 'react-dom';

//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DashboardActions from 'actions/dashboard';
import * as AuthActions from 'actions/auth';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import Select from 'react-select';
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
	Spinner,
	ButtonDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Breadcrumb,
	BreadcrumbItem,
	FormGroup,
} from 'reactstrap';

import { inventory_sublinks } from 'helpers/sublinks/Inventory/';

import NavBar from 'components/Navbars/NavBar';
import InventorySidebar from 'components/Sidebars/InventorySidebar';
import InventorySubSidebar from 'components/SubSidebars/InventorySubSidebar';
import GrowSpinner from 'components/Spinners/GrowSpinner';
import ConfirmDelete from 'components/Modals/ConfirmDelete';
import NoAccess from 'components/CustomComponents/NoAccess';
import LoggingOut from 'components/CustomComponents/LoggingOut';

var $ = require( 'jquery' );
$.DataTable = require('datatables.net');

const mainTableClass = ".bn-in-stock-table";
const mainTableClassName = "bn-in-stock-table";

class AddBrandNewUnit extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			value: '',
			spinnerIsVisible: false,
			dt_data: [],
			confirmDeleteShown: false,
			noEvent: false,
			isOpen: false,
			selectedBrand: '',
		}
	}

	componentDidMount(){
		const that = this;
		let { value, spinnerIsVisible, dt_data } = this.state;
		var mainTable = $(mainTableClass).DataTable({
			"data": dt_data,
			"columnDefs": [
				{
					"targets": 0,
					"visible": false,
				},
				{
					"targets": 6,
					"width": 150
				}
			],
      "columns": [
          {title: "DATA OBJECT"},
          {title: "MODEL"},
          {title: "CHASSIS NO."},
          {title: "ENGINE NO."},
          {title: "BRANCH"},
          {title: "DATE"},
          {title: "ACTION", createdCell: (td, cellData, rowData, row, col) => {
						ReactDOM.render(<div>
										<Button color="primary" size="sm" className="edit">
											Edit
										</Button>
										<Button color="warning" size="sm" className="view">
											View
										</Button>
										<Button color="danger" size="sm" className="delete">
											Delete
										</Button>
									</div>, td)
          }},
      ],
			"sDom": '<"bottom"<t>ip><"clear">',
			initComplete: () => {

			},
			"drawCallBack": (a,b,c) => {
				console.log(a)
				console.log(b)
				console.log(c)
			}
		})

		$(`${mainTableClass}`).on("click", ".edit", function(){
			var data = mainTable.row($(this).parents('tr')).data();
			console.log("edit")
		})

		$(`${mainTableClass}`).on("click", ".delete", function(){
			var data = mainTable.row($(this).parents('tr')).data();
			console.log("delete")
			that.setState({confirmDeleteShown: true})
		})

		$(`${mainTableClass}`).on("click", ".view", function(){
			var data = mainTable.row($(this).parents('tr')).data();
			console.log("view")
		})
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
		const dt_data = [
			[
				[],'fury', '4234234', '567765756', 'silay', '05/23/2020', '',
			],
			[
				[],'raider 115', '87987905', '234234231', 'talisay', '09/23/2020', '',
			],
			[
				[],'sniper 150', '34534006', '653234436', 'bacolod', '08/23/2020', '',
			]
		]

		const that = this;
		let { value } = this.state;

		this.setState({spinnerIsVisible: true,noEvent: true})

		$(".dataTables_empty").html("<br />")

		setTimeout(() => {
			that.setState({spinnerIsVisible: false, noEvent: false})
			$(".dataTables_empty").html("<span>No data available in table</span>")
			that.reDrawDataTable(dt_data)
		}, 1000 * 2)
	}
	reDrawDataTable = (data) => {
	  const table = $(mainTableClass).DataTable();
	  table.clear();
	  table.rows.add(data);
	  table.draw();
	}
	closeModal = () => {
		const that = this;

		that.setState({confirmDeleteShown: false})
	}
	deleteFunction = () => {
		console.log('delete function here ...')
	}
	toggleSubSidebar = () => {
		let { isOpen } = this.state;

		this.setState({isOpen: !isOpen})
	}
  handleChangeBrand = (option) => {
    this.setState({selectedBrand: option})
  }

	render() {
		let { value,spinnerIsVisible,confirmDeleteShown,noEvent,isOpen,selectedBrand, } = this.state;
		let { loggingOut,brandsSelect, } = this.props;
		let table_class_name = noEvent ? "bn-in-stock-table acustom-disabled" : "bn-in-stock-table";
		let brandOptions = brandsSelect.filter((v) => v.value != "all");
		const currentPage = ["Brand New - In Stock","/brand_new_in_stock/"];
		const permission = true;
		return (
			<div>
				<LoggingOut loggingOut={loggingOut} />
				<InventorySidebar history={this.props.history} component="Inventory" />
				<div className="content">
					<NavBar data={this.props} system="Inventory" history={this.props.history} logout={this.logOut}/>
						<ConfirmDelete className="" modal={confirmDeleteShown} callBack={this.deleteFunction} closeModal={this.closeModal} />
						{
							permission ?
							<div>
								<InventorySubSidebar subpage={currentPage[1]} history={this.props.history} />
								<Container className="with-subsidebar" fluid style={{paddingBottom: 20}}>
									<Row>
										<Col xs="6">
											<h1 className="page-title inner">Inventory</h1>
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
									      		inventory_sublinks.map((link, key) => {
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
									<Row>
										<Breadcrumb>
							        <BreadcrumbItem><a href="#">Inventory</a></BreadcrumbItem>
							        <BreadcrumbItem active>Add Brand New Units</BreadcrumbItem>
							      </Breadcrumb>
									</Row>
									<Row className="page-header">
										<Col>
											<h4>Add Brand New Units </h4>
										</Col>
									</Row>
									<Row>
										<br />
									</Row>
									<Row>
										<Col md="6">
											<FormGroup>
												<label>Brand</label><br />
					          		<Select
					                options={brandOptions}
					                placeholder="Select Brand"
					                value={selectedBrand}
					                onChange={this.handleChangeBrand}
					              />
											</FormGroup>
											<FormGroup>
												<label>Model</label><br />
					          		<Select
					                options={brandOptions}
					                placeholder="Select Model"
					                value={selectedBrand}
					                onChange={this.handleChangeBrand}
					              />
											</FormGroup>
											<FormGroup>
												<label>Engine Number</label><br />
					          		<Input />
											</FormGroup>
											<FormGroup>
												<label>Chassis Number</label><br />
					          		<Input />
											</FormGroup>
											<FormGroup>
												<label>Color</label><br />
					          		<Input />
											</FormGroup>
											<FormGroup>
												<label>Date Received</label><br />
					          		<Input />
											</FormGroup>
										</Col>
										<Col md="6">
											<FormGroup>
												<label>Branch</label><br />
					          		<Select
					                options={brandOptions}
					                placeholder="Select Branch"
					                value={selectedBrand}
					                onChange={this.handleChangeBrand}
					              />
											</FormGroup>
											<FormGroup>
												<label>Delivery Receipt Number</label><br />
					          		<Input />
											</FormGroup>
											<FormGroup>
												<label>Delivery Receipt Date</label><br />
					          		<Input />
											</FormGroup>
											<FormGroup>
												<label>Invoice Number</label><br />
					          		<Input />
											</FormGroup>
											<FormGroup>
												<label>Invoice Date</label><br />
					          		<Input />
											</FormGroup>
											<FormGroup>
												<label>Price</label><br />
					          		<Input />
											</FormGroup>
										</Col>
									</Row>
									<Row>
										<Col md="3">
											<FormGroup>
					          		<Button size="sm" color="primary"><FontAwesomeIcon icon="check" /></Button>{' '}
												<label>Warranty Booklet</label><br />
											</FormGroup>
										</Col>
										<Col md="3">
											<FormGroup>
					          		<Button size="sm" color="primary"><FontAwesomeIcon icon="check" /></Button>{' '}
												<label>Clearances</label><br />
											</FormGroup>
										</Col>
										<Col md="3">
											<FormGroup>
					          		<Button size="sm" color="primary"><FontAwesomeIcon icon="check" /></Button>{' '}
												<label>TBA's</label><br />
											</FormGroup>
										</Col>
									</Row>
									<Row>
										<Col md="12">
											<FormGroup>
					          		<Button size="sm" color="primary"><FontAwesomeIcon icon="check" /></Button>{' '}
												<label>Save template for next entry (Except for Chassis and Engine Numbers)</label><br />
											</FormGroup>
										</Col>
									</Row>
									<Row>
										<Col md="2">
											<FormGroup>
					          		<Button color="secondary" block>Cancel</Button>
											</FormGroup>
										</Col>
										<Col />
										<Col md="4">
											<FormGroup>
					          		<Button color="primary" block>Save and Add New Entry</Button>
											</FormGroup>
										</Col>
										<Col md="4">
											<FormGroup>
					          		<Button color="info" block>Save and Close</Button>
											</FormGroup>
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
  userData: state.login.userData,
  loggingOut: state.user_auth.loggingOut,
  brandsSelect: state.category.brandsSelect,
});

function mapDispatchToProps(dispatch) {
   return { actions: bindActionCreators(Object.assign({}, DashboardActions, AuthActions), dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddBrandNewUnit);

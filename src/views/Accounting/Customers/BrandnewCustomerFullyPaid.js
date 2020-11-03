import React from 'react';
import ReactDOM from 'react-dom';

//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DashboardActions from 'actions/dashboard';
import * as AuthActions from 'actions/auth';

import { Link } from 'react-router-dom';
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
	Spinner,
	ButtonDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
} from 'reactstrap';

import NavBar from 'components/Navbars/NavBar';
import AccountingSidebar from 'components/Sidebars/AccountingSidebar';
import CustomersSubSidebar from 'components/SubSidebars/CustomersSubSidebar';
import GrowSpinner from 'components/Spinners/GrowSpinner';
import ConfirmDelete from 'components/Modals/ConfirmDelete';
import NoAccess from 'components/CustomComponents/NoAccess';

import { customer_sub_links } from 'helpers/sublinks/Accounting/';

var $ = require( 'jquery' );
$.DataTable = require('datatables.net');

const mainTableClass = ".bn-customer-installment-table"
const mainTableClassName = "bn-customer-installment-table"

class BrandnewCustomerFullyPaid extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			value: '',
			spinnerIsVisible: false,
			dt_data: [],
			confirmDeleteShown: false,
			noEvent: false,
			isOpen: false,
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
					"width": 100,
					"orderable": false,
				}
			],
      "columns": [
          {title: "DATA OBJECT"},
          {title: "name"},
          {title: "account no."},
          {title: "address"},
          {title: "contact no."},
          {title: "balance"},
          {title: "ACTION", createdCell: (td, cellData, rowData, row, col) => {
						ReactDOM.render(<div>
										<Button color="warning" size="sm" data-tip="View" className="view">
											View
										</Button>
										<Button color="primary" size="sm" data-tip="Edit" className="edit">
											Edit
										</Button>
									</div>, td)
          }},
      ],
			"sDom": '<"bottom"<t>ip><"clear">',
			initComplete: () => {

			},
			"drawCallBack": (a,b,c) => {
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
		this.props.actions.Authenticate(false)
		.then((res) => {
			if(res){
				that.props.history.push("/")
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
				[],'cruz, mario x', 'an4234234', 'brgy 1', '09091231234', '80,000', '',
			],
			[
				[],'perez, jelai x', 'an8798f905', 'brgy 4', '09991231234', '30,000', '',
			],
			[
				[],'moran, mario x', 'an345s34006', 'brgy 12', '09991231235', '54,000', '',
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
		}, 1000 * 5)
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

	render() {
		let { value, spinnerIsVisible, confirmDeleteShown, noEvent, isOpen } = this.state;
		let table_class_name = noEvent ? mainTableClassName : mainTableClassName;
		const permission = true;
		const currentPage = ["Brand New (Fully Paid)","/brandnew_customer_fully_paid/"];
		return (
			<div>
				<AccountingSidebar component="Customers" />
				<div className="content">
					<NavBar data={this.props} system="Accounting" history={this.props.history} logout={this.logOut}/>
					<ConfirmDelete className="" modal={confirmDeleteShown} callBack={this.deleteFunction} closeModal={this.closeModal} />
					{
						permission ?
						<div>
							<CustomersSubSidebar subpage="/brandnew_customer_fully_paid/"/>
							<Container className="with-subsidebar" fluid>
								<Row>
									<Col xs="6">
										<h1 className="page-title inner">Customers</h1>
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
								      		customer_sub_links.map((link, key) => {
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
										<h4>Customers with Fully Paid Accounts <small>(Brand New Units)</small> <Button className="es-main-btn" color="primary" size="sm"><FontAwesomeIcon className="font10" icon="plus" />  Add</Button> </h4>
									</Col>
								</Row>
								<Row>
									<Col>
										<Col className="advanced-filter">
											<h5>Filter</h5>
											<Row>
												<Col md="4"><Input placeholder="Enter Customer Name" onChange={(e) => this.handleChange(e)} value={value} /></Col>
												<Col md="4"><Input placeholder="Enter Account Number" /></Col>
												<Col md="4"><Button className="es-main-btn" color="primary" block onClick={this.advancedFilter} disabled={spinnerIsVisible}>Search</Button> </Col>
											</Row>
										</Col>
									</Col>
								</Row>
								<Row>
									<br />
								</Row>
								<Row>
									<Col className="allowScrollX">
										<GrowSpinner visible={spinnerIsVisible} />
										<Table className={mainTableClassName}>
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
   return { actions: bindActionCreators(Object.assign({}, DashboardActions, AuthActions), dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(BrandnewCustomerFullyPaid);

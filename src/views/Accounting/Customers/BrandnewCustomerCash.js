import React from 'react';
import ReactDOM from 'react-dom';

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
	Spinner,
} from 'reactstrap';

import NavBar from 'components/Navbars/NavBar';
import AccountingSidebar from 'components/Sidebars/AccountingSidebar';
import CustomersSubSidebar from 'components/SubSidebars/CustomersSubSidebar';
import GrowSpinner from 'components/Spinners/GrowSpinner';
import ConfirmDelete from 'components/Modals/ConfirmDelete';
import NoAccess from 'components/CustomComponents/NoAccess';

var $ = require( 'jquery' );
$.DataTable = require('datatables.net');

const mainTableClass = ".bn-in-stock-table"
const mainTableClassName = "bn-in-stock-table"

class BrandnewCustomerCash extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			value: '',
			spinnerIsVisible: false,
			dt_data: [],
			confirmDeleteShown: false,
			noEvent: false,
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
					"targets": 7,
					"width": 100
				}
			],
      "columns": [
          {title: "DATA OBJECT"},
          {title: "name"},
          {title: "area"},
          {title: "model"},
          {title: "engine"},
          {title: "date purchased"},
          {title: "payment"},
          {title: "action", createdCell: (td, cellData, rowData, row, col) => {
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
		this.props.actions.Authenticate(false)
		.then((res) => {
			if(res){
				that.props.history.push("/")
			}
		})
	}
	/* set input characters to uppercase */
	handleChange = (event) => {
		const that = this;
	  const input = event.target;
	  const start = input.selectionStart;
	  const end = input.selectionEnd;
	  let uppercasedValue = input.value.toUpperCase()

	  this.setState(
	    {value: uppercasedValue},
	    () => input.setSelectionRange(start, end)
	  );

	  that.advancedFilter()
	}

	advancedFilter = () => {
		const dt_data = [
			[
				[],'torres, mary grace x', 'bacolod', 'barako 175', '47745745', '05/23/2020', '90,000', ''
			],
			[
				[],'lim, marcus x', 'bacolod', 'ct 100', '456456456', '09/23/2020', '80,000', ''
			],
			[
				[],'salvador, jedidiah x', 'silay', 'raider 115', '85675656', '08/23/2020', '78,000', ''
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
		}, 1000 * 3)
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

	render() {
		let { value, spinnerIsVisible, confirmDeleteShown, noEvent } = this.state;
		let table_class_name = noEvent ? "bn-in-stock-table acustom-disabled" : "bn-in-stock-table";
		const permission = !true;
		return (
			<div>
				<AccountingSidebar component="Customers" />
				<div className="content">
					<NavBar data={this.props} system="Accounting" history={this.props.history} logout={this.logOut}/>
					<ConfirmDelete className="" modal={confirmDeleteShown} callBack={this.deleteFunction} closeModal={this.closeModal} />
					{
						permission ?
						<div>
							<CustomersSubSidebar subpage="/brandnew_customer_cash/"/>
							<Container className="with-subsidebar" fluid>
								<Row className="page-header">
									<Col>
										<h4>Customers with Brand New Units (Cash) <Button className="es-main-btn" color="primary" size="sm"><FontAwesomeIcon className="font10" icon="plus" />  Add</Button> </h4>
									</Col>
								</Row>
								<Row>
									<Col>
										<Col className="advanced-filter">
											<h5>Filter</h5>
											<Row>
												<Col md="4"><Input placeholder="Enter Customer Name" onChange={(e) => this.handleChange(e)} value={value} /></Col>
												<Col md="4"><Button className="es-main-btn" color="primary" block onClick={this.advancedFilter} disabled={spinnerIsVisible}>Search</Button> </Col>
											</Row>
										</Col>
									</Col>
								</Row>
								<Row>
									<br />
								</Row>
								<Row>
									<Col>
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

export default connect(mapStateToProps, mapDispatchToProps)(BrandnewCustomerCash);

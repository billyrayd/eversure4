import React from 'react';
import ReactDOM from 'react-dom';

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
	Spinner,
} from 'reactstrap';

import NavBar from 'components/Navbars/NavBar';
import AccountingSidebar from 'components/Sidebars/AccountingSidebar';
import AccReportsSubSidebar from 'components/SubSidebars/AccReportsSubSidebar';
import GrowSpinner from 'components/Spinners/GrowSpinner';
import ConfirmDelete from 'components/Modals/ConfirmDelete';

var $ = require( 'jquery' );
$.DataTable = require('datatables.net');

const mainTableClass = ".bn-customer-installment-table"
const mainTableClassName = "bn-customer-installment-table"

class ReportsCustomersWithRepossessedUnits extends React.PureComponent {
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
					"targets": 4,
					"width": 100,
					"orderable": false,
				}
			],
      "columns": [
          {title: "DATA OBJECT"},
          {title: "title"},
          {title: "date"},
          {title: "created by"},
          {title: "ACTION", createdCell: (td, cellData, rowData, row, col) => {
						ReactDOM.render(<div>
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

	render() {
		let { value, spinnerIsVisible, confirmDeleteShown, noEvent } = this.state;
		let table_class_name = noEvent ? mainTableClassName : mainTableClassName;
		return (
			<div>
				<AccountingSidebar component="Reports" />
				
				<div className="content">
						<NavBar data={this.props} system="Accounting" />
						<ConfirmDelete className="" modal={confirmDeleteShown} callBack={this.deleteFunction} closeModal={this.closeModal} />
						<AccReportsSubSidebar subpage="/reports_customers_with_repossessed_units/"/>
						<Container className="with-subsidebar" fluid>
							<Row className="page-header">
								<Col>
									<h4>Customers with Repossessed Units Reports <Button className="es-main-btn" color="primary" size="sm"><FontAwesomeIcon className="font10" icon="plus" />  Create</Button> </h4>
								</Col>
							</Row>
							<Row className="one-input-search">
								<Col md="6"><Input placeholder="Search Reports" onChange={(e) => this.handleChange(e)} value={value} /></Col>
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

export default connect(mapStateToProps, mapDispatchToProps)(ReportsCustomersWithRepossessedUnits);

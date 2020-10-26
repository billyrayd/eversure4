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
import InventorySidebar from 'components/Sidebars/InventorySidebar';
import InventorySubSidebar from 'components/SubSidebars/InventorySubSidebar';
import GrowSpinner from 'components/Spinners/GrowSpinner';
import ConfirmDelete from 'components/Modals/ConfirmDelete';

var $ = require( 'jquery' );
$.DataTable = require('datatables.net');

const mainTableClass = ".bn-in-stock-table"

class BrandNewInStock extends React.PureComponent {
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
										<Button color="primary" size="sm" data-tip="Edit" className="edit">
											Edit
											{/* <FontAwesomeIcon icon="edit"/> */}
										</Button>
										<Button color="danger" size="sm" data-tip="Delete" className="delete">
											Delete
											{/*<FontAwesomeIcon icon="trash" />*/}
										</Button>
										<Button color="warning" size="sm" data-tip="View" className="view">
											View
											{/*<FontAwesomeIcon className="text-white" icon="eye" />*/}
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
		let table_class_name = noEvent ? "bn-in-stock-table acustom-disabled" : "bn-in-stock-table";
		return (
			<div>
				<InventorySidebar component="Inventory" />
				
				<div className="content">
						<NavBar data={this.props} system="Inventory" />
						<ConfirmDelete className="" modal={confirmDeleteShown} callBack={this.deleteFunction} closeModal={this.closeModal} />
						<InventorySubSidebar subpage="/brand_new_in_stock/"/>
						<Container className="with-subsidebar" fluid>
							<Row className="page-header">
								<Col>
									<h4>Units in Stock <Button className="es-main-btn" color="primary" size="sm"><FontAwesomeIcon className="font10" icon="plus" />  Add</Button> </h4>
								</Col>
							</Row>
							<Row>
								<Col>
									<Col className="advanced-filter">
										<h5>Advanced Filter</h5>
										<Row>
											<Col md="4"><Input placeholder="Select Date" onChange={(e) => this.handleChange(e)} value={value} /></Col>
											<Col md="4"><Input placeholder="Enter Brand" /></Col>
											<Col md="4"><Input placeholder="Enter Model" /></Col>
										</Row>
										<div className="space" />
										<Row>
											<Col md="4"><Input placeholder="Enter Engine Number" /></Col>
											<Col md="4"><Input placeholder="Select Branch" /></Col>
											<Col md="4"><Button className="es-main-btn" color="primary" block onClick={this.advancedFilter} disabled={spinnerIsVisible}>Apply Filter</Button> </Col>
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
									<Table className={table_class_name}>
										{
											/*
										<thead>
											<tr>
												<th>model</th>
												<th>chassis no.</th>
												<th>engine no.</th>
												<th>branch</th>
												<th>date received</th>
												<th>action</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td>Fury</td>
												<td>2334F3H324</td>
												<td>654F23Q23P</td>
												<td>silay</td>
												<td>05/12/19</td>
												<td>
													<Button color="primary" size="sm" id="edit" >
														<FontAwesomeIcon icon="edit"/>
														<Tooltip target="edit" placement="top" autohide={true} isOpen={isOpenEdit} toggle={this.toggleEdit}>Edit</Tooltip>
													</Button>
													<Button color="danger" size="sm" id="delete">
														<FontAwesomeIcon icon="trash" />
														<Tooltip target="delete" placement="top" autohide={true} isOpen={isOpenDelete} toggle={this.toggleDelete}>Delete</Tooltip>
													</Button>
													<Button color="warning" size="sm" id="view">
														<FontAwesomeIcon className="text-white" icon="eye" />
														<Tooltip target="view" placement="top" autohide={true} isOpen={isOpenView} toggle={this.toggleView}>View</Tooltip>
													</Button>
												</td>
											</tr>
											<tr>
												<td>Fury</td>
												<td>2334F3H324</td>
												<td>654F23Q23P</td>
												<td>talisay</td>
												<td>05/12/19</td>
												<td>
													<Button color="primary" size="sm"><FontAwesomeIcon icon="edit" /></Button>
													<Button color="danger" size="sm"><FontAwesomeIcon icon="trash" /></Button>
													<Button color="warning" size="sm"><FontAwesomeIcon className="text-white" icon="eye" /></Button>
												</td>
											</tr>
											<tr>
												<td>Fury</td>
												<td>2334F3H324</td>
												<td>654F23Q23P</td>
												<td>bacolod</td>
												<td>05/12/19</td>
												<td>
													<Button color="primary" size="sm"><FontAwesomeIcon icon="edit" /></Button>
													<Button color="danger" size="sm"><FontAwesomeIcon icon="trash" /></Button>
													<Button color="warning" size="sm"><FontAwesomeIcon className="text-white" icon="eye" /></Button>
												</td>
											</tr>
										</tbody>
										*/}
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

export default connect(mapStateToProps, mapDispatchToProps)(BrandNewInStock);

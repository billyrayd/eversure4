import React from 'react';
import ReactDOM from 'react-dom';

//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DashboardActions from 'actions/dashboard';
import * as AuthActions from 'actions/auth';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

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
import InventorySidebar from 'components/Sidebars/InventorySidebar';
import InventorySubSidebar from 'components/SubSidebars/InventorySubSidebar';
import GrowSpinner from 'components/Spinners/GrowSpinner';
import ConfirmDelete from 'components/Modals/ConfirmDelete';
import NoAccess from 'components/CustomComponents/NoAccess';

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
	toggleSubSidebar = () => {
		let { isOpen } = this.state;

		this.setState({isOpen: !isOpen})
	}

	render() {
		let { value, spinnerIsVisible, confirmDeleteShown, noEvent, isOpen } = this.state;
		let table_class_name = noEvent ? "bn-in-stock-table acustom-disabled" : "bn-in-stock-table";

		let sublinks = [
			{ name: 'Brand New', path: '/', visible: true, className: "nav-link-header custom-disabled text-uppercase", nonLink: true },
			{ name: 'In Stock', path: '/brand_new_in_stock/', visible: true },
			{ name: 'Sold', path: '/brand_new_sold/', visible: true },
			{ name: 'Transfer', path: '/transfer/', visible: true },
			{ name: 'Outgoing', path: '/outgoing/', visible: true },
			{ name: 'Incoming', path: '/incoming/', visible: true },
			{ name: 'divider', path: '/', visible: true, className: 'divider custom-disabled', nonLink: true, divider: true },
			{ name: 'Secondhand', path: '/', visible: true, className: "nav-link-header custom-disabled text-uppercase", nonLink: true },
			{ name: 'In Stock', path: '/secondhand_in_stock/', visible: true },
			{ name: 'Sold', path: '/secondhand_sold/', visible: true },
			{ name: 'divider', path: '/', visible: true, className: 'divider custom-disabled', nonLink: true, divider: true },
			{ name: 'Search D.R.', path: '/search_dr/', visible: true },
			{ name: 'Duplicate Entries', path: '/duplicate_entries/', visible: true },
		]

		const currentPage = ["In Stock","/brand_new_in_stock/"];

		const permission = true;
		return (
			<div>
				<InventorySidebar component="Inventory" />
				<div className="content">
					<NavBar data={this.props} system="Inventory" history={this.props.history} logout={this.logOut}/>
						<ConfirmDelete className="" modal={confirmDeleteShown} callBack={this.deleteFunction} closeModal={this.closeModal} />
						{
							permission ?
							<div>
								<InventorySubSidebar subpage="/brand_new_in_stock/"/>
								<Container className="with-subsidebar" fluid>
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
									      		sublinks.map((link, key) => {
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
										<Col className="allowScrollX">
											<GrowSpinner visible={spinnerIsVisible} />
											<Table className={table_class_name} />
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

export default connect(mapStateToProps, mapDispatchToProps)(BrandNewInStock);

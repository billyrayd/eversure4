import React from 'react';
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
} from 'reactstrap';

import NavBar from 'components/Navbars/NavBar';
import InventorySidebar from 'components/Sidebars/InventorySidebar';
import InventorySubSidebar from 'components/SubSidebars/InventorySubSidebar';

var $ = require( 'jquery' );
$.DataTable = require('datatables.net');

class BrandNewInStock extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			isOpenEdit: false,
			isOpenDelete: false,
			isOpenView: false,
			value: ''
		}
	}

	componentDidMount(){
		$(".bn-in-stock-table").DataTable({
			"sDom": '<"bottom"<t>ip><"clear">',
			initComplete: () => {
			}
		})
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

	render() {
		let { isOpenEdit, isOpenDelete, isOpenView, value } = this.state;
		return (
			<div>
				<InventorySidebar component="Inventory" />
				<div className="content">
						<NavBar data={this.props}/>
						<InventorySubSidebar subpage="/brand_new_in_stock/"/>
						<Container className="with-subsidebar" fluid>
							<Row className="page-header">
								<Col>
									<h3>Units in Stock <Button className="es-main-btn" color="primary" size="sm"><FontAwesomeIcon className="font10" icon="plus" />  Add</Button> </h3>
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
											<Col md="4"><Button className="es-main-btn" color="primary" block onClick={this.advancedFilter}>Apply Filter</Button> </Col>
										</Row>
									</Col>
								</Col>
							</Row>
							<Row>
								<br />
							</Row>
							<Row>
								<Col>
									<Table className="bn-in-stock-table">
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

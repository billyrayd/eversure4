import React from 'react';
import ReactDOM from 'react-dom';
//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DashboardActions from 'actions/dashboard';
import * as AuthActions from 'actions/auth';

import { Link } from "react-router-dom";
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

import NavBar from 'components/Navbars/NavBar';
import InventorySidebar from 'components/Sidebars/InventorySidebar';
import NoAccess from 'components/CustomComponents/NoAccess';
import AddPayment from './Modals/AddPayment';
import LoggingOut from 'components/CustomComponents/LoggingOut';

var $ = require( 'jquery' );

const mainTableClass = ".payments-table";
const mainTableClassName = "payments-table";

class Payments extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			paymentAddMdlIsOpen: false
		}
	}
	componentDidMount(){
		var mainTable = $(mainTableClass).DataTable({
			data: [],
			"sDom": '<"bottom"<t>ip><"clear">',
			"columnDefs": [
				{
					"targets": 0,
					"visible": false,
				},
			],
      "columns": [
          {title: "DATA OBJECT"},
          {title: "supplier name"},
          {title: "receipt no."},
          {title: "amount paid"},
          {title: "date paid"},
          {title: "remarks"},
      //     {title: "action", createdCell: (td, cellData, rowData, row, col) => {
						// ReactDOM.render(<div>
						// 				<Button color="primary" size="sm" className="check">
						// 					Verify Email
						// 				</Button>
						// 			</div>, td)
      //     }},
      ],
			initComplete: () => {
			}
		})

		$('.dt-search').keyup(function () {
      mainTable.search($(this).val()).draw();
    });

    this.getPayments();
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
	getPayments = () => {
		const dt_data = [
			[
				[], "suzuki motors", "121001287", "1,000,000", "12/22/2019", 'okay',
			],
			[
				[], "suzuki motors", "154621001", "1,000,000", "03/09/2020", 'lorem ipsum',
			],
			[
				[], "suzuki motors", "436450023", "1,000,000","01/12/2020", 'okay',
			]
		]

		this.reDrawDataTable(dt_data);
	}
	reDrawDataTable = (data) => {
	  const table = $(mainTableClass).DataTable();
	  table.clear();
	  table.rows.add(data);
	  table.draw();
	}
	addPaymentCb = () => {

	}
	showModal = (type, status) => {
		const that = this;
		switch(type){
			case 'add':
			that.setState({paymentAddMdlIsOpen: status}); break;
			default:
			that.setState({paymentAddMdlIsOpen: status}); break;
		}
	}

	render() {
		let { paymentAddMdlIsOpen } = this.state;
		let { actions,loggingOut, } = this.props;
		const permission = true;

		return (
			<div>
				<LoggingOut loggingOut={loggingOut} />
				<InventorySidebar history={this.props.history} component="Payments" />
				<AddPayment modal={paymentAddMdlIsOpen} className="es-modal payment" callBack={this.addPaymentCb} closeModal={() => this.showModal('delete', false)} actions={actions} />
				<div className="content">
					<NavBar data={this.props} system="Inventory" history={this.props.history} logout={this.logOut}/>
						{
							permission ?
							<div>
								<Container fluid>
									<Row>
										<Col xs="6" md="9">
											<h1 className="page-title">Payments <Button color="primary" className="es-main-btn add-payments" onClick={() => this.showModal("add", true)}><FontAwesomeIcon icon="plus" /> Add Payment</Button></h1>
										</Col>
										<Col xs="6" md="3">
											<Link to="/" className="main-link mobile"><FontAwesomeIcon icon="caret-left"/> main menu</Link>
										</Col>
										<Col md="12"><Button color="primary" className="es-main-btn add-payments mobile" block onClick={() => this.showModal("add", true)}><FontAwesomeIcon icon="plus" /> Add Payment</Button></Col>
									</Row>
									<Row className="one-input-search">
										<Col md="3"><Input placeholder="Enter Date" /></Col>
									</Row>
									<Row>
										<div className="space" />
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
});

function mapDispatchToProps(dispatch) {
   return { actions: bindActionCreators(Object.assign({}, DashboardActions, AuthActions), dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Payments);

import React from 'react';
import ReactDOM from 'react-dom';
//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DashboardActions from 'actions/dashboard';
import * as AuthActions from 'actions/auth';

import { Link } from "react-router-dom";
import PerfectScrollbar from "perfect-scrollbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import toastr from 'toastr';

//reactstrap
import {
	Container,
	Row,
	Col,
	Table,
	Button,
	Input,
} from 'reactstrap';

import NavBar from 'components/Navbars/NavBar';
import InventorySidebar from 'components/Sidebars/InventorySidebar';
import NoAccess from 'components/CustomComponents/NoAccess';
import LoggingOut from 'components/CustomComponents/LoggingOut';

var $ = require( 'jquery' );

var ps;

const mainTableClass = ".notifications-table";
const mainTableClassName = "notifications-table";

class Notifications extends React.PureComponent {
	constructor(props) {
		super(props);

		this.mainContent = React.createRef();
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
				{
					"orderable": false,
					"targets": 3,
					"width": 150
				}
			],
      "columns": [
          {title: "DATA OBJECT"},
          {title: "email"},
          {title: "date"},
          {title: "action", createdCell: (td, cellData, rowData, row, col) => {
						ReactDOM.render(<div>
										<Button color="primary" size="sm" className="check">
											Verify Email
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

    this.getNotifications();
	}
  componentWillUnmount() {
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
	getNotifications = () => {
		const dt_data = [
			[
				[], "email1@email.com", "10/22/2020 - 9:21:56 AM", '',
			],
			[
				[], "email2@email.com", "10/22/2020 - 9:21:56 AM", '',
			],
			[
				[], "email3@email.com", "10/22/2020 - 9:21:56 AM", '',
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

	render() {
		let { loggingOut } = this.props;
		var data = [
			{ letter: 'A' },
			{ letter: 'B' },
			{ letter: 'C' },
			{ letter: 'D' },
			{ letter: 'E' },
		];

		const permission = true;
		return (
			<div>
				<LoggingOut loggingOut={loggingOut} />
				<InventorySidebar history={this.props.history} component="Notifications" />
				<div className="content" ref={this.mainContent}>
					<NavBar data={this.props} system="Inventory" history={this.props.history} logout={this.logOut}/>
					{
						permission ?
						<div className="main-panel">
							<Container fluid>
								<Row>
									<Col xs="6" md="9">
										<h1 className="page-title">Notifications</h1>
									</Col>
									<Col xs="6" md="3">
										<Link to="/" className="main-link mobile"><FontAwesomeIcon icon="caret-left"/> main menu</Link>
									</Col>
								</Row>
								<Row className="one-input-search">
									<Col md="6"><Input className="dt-search" placeholder="Search Notifications" /></Col>
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

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);

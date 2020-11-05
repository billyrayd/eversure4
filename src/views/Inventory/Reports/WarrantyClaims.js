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

import { reports_sublinks } from 'helpers/sublinks/Inventory/';

import NavBar from 'components/Navbars/NavBar';
import InventorySidebar from 'components/Sidebars/InventorySidebar';
import ReportsSubSidebar from 'components/SubSidebars/ReportsSubSidebar';
import GrowSpinner from 'components/Spinners/GrowSpinner';
import NoAccess from 'components/CustomComponents/NoAccess';

var $ = require( 'jquery' );
$.DataTable = require('datatables.net');

const mainTableClass = ".unsold-units-table";
const mainTableClassName = "unsold-units-table";

class WarrantyClaims extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			isOpenEdit: false,
			isOpenDelete: false,
			isOpenView: false,
			value: '',
			isOpen: false,
			spinnerIsVisible: false,
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
					"targets": 5,
					"width": 150,
					"orderable": false,
				},
			],
      "columns": [
          {title: "DATA OBJECT"},
          {title: "title"},
          {title: "date created"},
          {title: "created by"},
          {title: "branch"},
          {title: "ACTION", createdCell: (td, cellData, rowData, row, col) => {
						ReactDOM.render(<div>
										<Button color="success" size="sm" className="edit">
											Accept
										</Button>
										<Button color="danger" size="sm" className="view">
											Reject
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

		$('.dt-search').keyup(function () {
      mainTable.search($(this).val()).draw();
    });
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
	toggleSubSidebar = () => {
		let { isOpen } = this.state;

		this.setState({isOpen: !isOpen})
	}

	render() {
		let { isOpenEdit, isOpenDelete, isOpenView, value, isOpen, spinnerIsVisible } = this.state;
		const permission = true;

		const currentPage = ["Warranty Claims","/warranty_claims/"];
		return (
			<div>
				<InventorySidebar component="Reports" />
				<div className="content">
					<NavBar data={this.props} system="Inventory" history={this.props.history} logout={this.logOut}/>
						{
							permission ?
							<div>
								<ReportsSubSidebar subpage={currentPage[1]} />
								<Container className="with-subsidebar" fluid>
									<Row>
										<Col xs="6">
											<h1 className="page-title inner">Reports</h1>
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
									      		reports_sublinks.map((link, key) => {
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
										<h4>Units with Warranty Claims Report List<Button className="es-main-btn" color="primary" size="sm"><FontAwesomeIcon className="font10" icon="plus" />  Add</Button> </h4>
									</Col>
								</Row>
								<Row className="one-input-search">
										<Col md="6"><Input className="dt-search" placeholder="Search Reports" /></Col>
								</Row>
								<Row>
									<br />
								</Row>
								<Row>
									<Col className="allowScrollX">
										<GrowSpinner visible={spinnerIsVisible} />
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
});

function mapDispatchToProps(dispatch) {
   return { actions: bindActionCreators(Object.assign({}, DashboardActions, AuthActions), dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(WarrantyClaims);

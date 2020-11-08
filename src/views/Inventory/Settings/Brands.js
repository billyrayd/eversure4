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
	ButtonDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
} from 'reactstrap';

import { settings_sub_links } from 'helpers/sublinks/Inventory/';

import NavBar from 'components/Navbars/NavBar';
import InventorySidebar from 'components/Sidebars/InventorySidebar';
import SettingsSubSidebar from 'components/SubSidebars/SettingsSubSidebar';
import NoAccess from 'components/CustomComponents/NoAccess';

var $ = require( 'jquery' );
$.DataTable = require('datatables.net');

const mainTableClass = ".brands-table";
const mainTableClassName = "brands-table";

class Brands extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			isOpenEdit: false,
			isOpenDelete: false,
			isOpenView: false,
			value: '',
			isOpen: false,
		}
	}

	componentDidMount(){
		const that = this;
		var mainTable = $(mainTableClass).DataTable({
			data: [],
			"sDom": '<"bottom"<t>ip><"clear">',
			"columnDefs": [
				{
					"targets": 0,
					"visible": false,
				},
				{
					"targets": 1,
					"width": 20,
				},
				{
					"orderable": false,
					"targets": 3,
					"width": 100
				}
			],
      "columns": [
          {title: "DATA OBJECT"},
          {title: "no."},
          {title: "brand name"},
          {title: "action", createdCell: (td, cellData, rowData, row, col) => {
						ReactDOM.render(<div>
										<Button color="primary" size="sm" className="edit">
											Edit
										</Button>
										<Button color="danger" size="sm" className="delete">
											Delete
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

    that.loadBrands();
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
	loadBrands = () => {
		let { brandList } = this.props;

		this.reDrawDataTable(brandList);
	}
	reDrawDataTable = (data) => {
	  const table = $(mainTableClass).DataTable();
	  table.clear();
	  table.rows.add(data);
	  table.draw();
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
		let { isOpenEdit, isOpenDelete, isOpenView, value, isOpen } = this.state;
		const permission = true;

		const currentPage = ["Brands","/brands/"];
		return (
			<div>
				<InventorySidebar component="Settings" />
				<div className="content">
					<NavBar data={this.props} system="Inventory" history={this.props.history} logout={this.logOut}/>
						{
							permission ?
							<div>
								<SettingsSubSidebar subpage="/brands/"/>
								<Container className="with-subsidebar" fluid>
									<Row>
										<Col xs="6">
											<h1 className="page-title inner">Settings</h1>
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
									      		settings_sub_links.map((link, key) => {
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
											<h4>Motorcycle Brands List<Button className="es-main-btn" color="primary" size="sm"><FontAwesomeIcon className="font10" icon="plus" />  Add</Button> </h4>
										</Col>
									</Row>
									<Row className="one-input-search">
											<Col md="6"><Input className="dt-search" placeholder="Search Brands" /></Col>
									</Row>
									<Row>
										<br />
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
  brandList: state.category.brandsList,
});

function mapDispatchToProps(dispatch) {
   return { actions: bindActionCreators(Object.assign({}, DashboardActions, AuthActions), dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Brands);

import React from 'react';
import ReactDOM from 'react-dom';
//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as AuthActions from 'actions/auth';
import * as CategoryActions from 'actions/prev/category';

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
import AddModel from './Modals/AddModel';
import EditModel from './Modals/EditModel';
import DeleteModel from './Modals/DeleteModel';

var $ = require( 'jquery' );
$.DataTable = require('datatables.net');

const mainTableClass = ".users-table";
const mainTableClassName = "users-table";

class Models extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			isOpenEdit: false,
			isOpenDelete: false,
			isOpenView: false,
			value: '',
			isOpen: false,
			model: [],
		}
	}

	componentDidMount(){
		const that = this;
		let { modelList } = this.props;
		var mainTable = $(mainTableClass).DataTable({
			data: modelList,
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
					"targets": 4,
					"width": 100
				}
			],
      "columns": [
          {title: "DATA OBJECT"},
          {title: "no."},
          {title: "model name"},
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

    $(mainTableClass).on("click",".edit", function(){
    	const data = mainTable.row($(this).parents('tr')).data();
    	const modelId = data[0];
    	const modelName = data[2];
    	const brandName = {value: data[5].brand_details._id, label: data[5].brand_details.brand_name};

    	that.setState({model: [modelId,modelName,brandName]});
    	that.showModal("edit", true);
    });

    $(mainTableClass).on("click",".delete", function(){
    	const data = mainTable.row($(this).parents('tr')).data();
    	const modelId = data[0];
    	const modelName = data[2];

    	that.setState({model: [modelId,modelName]});
    	that.showModal("delete", true);
    });

    that.loadModels();
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
	loadModels = () => {
		const that = this;
		let { modelList } = this.props;

		that.props.actions.GetCategoryModels()
		.then((res) => {
			if(res){
				that.reDrawDataTable(res);
			}
		})
	}
	reDrawDataTable = (data) => {
	  const table = $(mainTableClass).DataTable();
	  table.clear();
	  table.rows.add(data);
	  table.draw();
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
	modalCallback = () => {
		this.loadModels();
	}
	showModal = (type, status) => {
		const that = this;
		switch(type){
			case 'add':
			that.setState({modelAddMdlIsOpen: status}); break;
			case 'edit':
			that.setState({modelEditMdlIsOpen: status}); break;
			case 'delete':
			that.setState({modelDeleteMdlIsOpen: status}); break;
			default: return false;
		}
	}
	toggle = (type) => {
		const that = this;
		let { modelAddMdlIsOpen,modelEditMdlIsOpen,modelDeleteMdlIsOpen } = this.state;

		switch(type){
			case 'add':
				that.setState({modelAddMdlIsOpen: !modelAddMdlIsOpen}); break;
			case 'edit':
				that.setState({modelEditMdlIsOpen: !modelEditMdlIsOpen}); break;
			case 'delete':
				that.setState({modelDeleteMdlIsOpen: !modelDeleteMdlIsOpen}); break;
			default: return false;
		}
	}
	opened = () => {
		$(".modal #delete").focus();
	}

	render() {
		let { value,isOpen,modelAddMdlIsOpen,modelEditMdlIsOpen,modelDeleteMdlIsOpen,model } = this.state;
		let { actions } = this.props;
		const permission = true;

		const currentPage = ["Models","/models/"];
		return (
			<div>
				<InventorySidebar history={this.props.history} component="Settings" />
				<AddModel
					modal={modelAddMdlIsOpen}
					className="es-modal"
					callBack={this.modalCallback}
					closeModal={() => this.showModal('add', false)}
					actions={actions}
					toggle={() => this.toggle("add")}
				/>
				<EditModel
					modal={modelEditMdlIsOpen}
					className="es-modal"
					callBack={this.modalCallback}
					closeModal={() => this.showModal('edit', false)}
					actions={actions}
					toggle={() => this.toggle("edit")}
					data={model}
				/>
				<DeleteModel
					modal={modelDeleteMdlIsOpen}
					className="es-modal"
					callBack={this.modalCallback}
					closeModal={() => this.showModal('delete', false)}
					actions={actions}
					toggle={() => this.toggle("delete")}
					data={model}
					onOpened={this.opened}
				/>
				<div className="content">
					<NavBar data={this.props} system="Inventory" history={this.props.history} logout={this.logOut}/>
						{
							permission ?
							<div>
								<SettingsSubSidebar subpage="/models/" history={this.props.history} />
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
											<h4>Motorcycle Models List<Button className="es-main-btn" color="primary" size="sm" onClick={() => this.showModal("add",true)}><FontAwesomeIcon className="font10" icon="plus" />  Add</Button> </h4>
										</Col>
									</Row>
									<Row className="one-input-search">
											<Col md="6"><Input className="dt-search" placeholder="Search Models" /></Col>
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
  modelList: state.category.modelsList,
});

function mapDispatchToProps(dispatch) {
   return { actions: bindActionCreators(Object.assign({}, AuthActions, CategoryActions), dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Models);

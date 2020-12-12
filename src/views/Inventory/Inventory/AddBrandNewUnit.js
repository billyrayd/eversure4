import React from 'react';
import ReactDOM from 'react-dom';

//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DashboardActions from 'actions/dashboard';
import * as AuthActions from 'actions/auth';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import toastr from 'toastr';
import InputMask from "react-input-mask";

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
	Breadcrumb,
	BreadcrumbItem,
	FormGroup,
} from 'reactstrap';

import { _currency,_numberWithCommas } from 'helpers/';
import { inventory_sublinks } from 'helpers/sublinks/Inventory/';

import NavBar from 'components/Navbars/NavBar';
import InventorySidebar from 'components/Sidebars/InventorySidebar';
import InventorySubSidebar from 'components/SubSidebars/InventorySubSidebar';
import GrowSpinner from 'components/Spinners/GrowSpinner';
import ConfirmDelete from 'components/Modals/ConfirmDelete';
import NoAccess from 'components/CustomComponents/NoAccess';
import LoggingOut from 'components/CustomComponents/LoggingOut';

var $ = require( 'jquery' );

class AddBrandNewUnit extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			value: '',
			spinnerIsVisible: false,
			dt_data: [],
			confirmDeleteShown: false,
			noEvent: false,
			isOpen: false,

			selectedBrand: '',
			selectedModel: '',
			engine_number: '',
			chassis_number: '',
			color: '',
			date_received: '',
			selectedBranch: '',
			dr_number: '',
			dr_date: '',
			invoice_number: '',
			invoice_date: '',
			price: '',
			warranty_booklet: false,
			clearances: false,
			tba: false,
			saveTemplate: false,

			modelOptions: [],
		}
	}
	componentWillMount(){
		const that = this;
		let { userData } = this.props;
		let userBranchId = userData.branch_info._id;
		let userBranchName = userData.branch_info.branch_name;
		that.setState({selectedBranch: {value: userBranchId, label:userBranchName}})
	}
	componentDidMount(){
		const that = this;
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
  handleChangeBrand = (option) => {
  	const that = this;
  	let { modelsSelect } = that.props;
  	let { selectedBrand } = that.state;
  	let modelOpt = modelsSelect.filter(v => v.brand == option.value);

  	let update = {
  		selectedBrand: option,
  		modelOptions: modelOpt
  	}

  	if(selectedBrand !== option){
  		update.selectedModel = ''
  	}

    that.setState(update);
  }
  handleChangeModel = (option) => {
    this.setState({selectedModel: option})
  }
  handleChangeBranch = (option) => {
    this.setState({selectedBranch: option})
  }
	changeInput = (event,name) => {
		const that = this;
	  const input = event.target;
	  const start = input.selectionStart;
	  const end = input.selectionEnd;
		let inputVal = input.value;
	  let uppercasedValue = inputVal.toUpperCase();

	  switch(name){
  		case 'engine_number':
			  that.setState(
			    {engine_number: uppercasedValue},
			    () => input.setSelectionRange(start, end)
			  ); break;
  		case 'chassis_number':
			  that.setState(
			    {chassis_number: uppercasedValue},
			    () => input.setSelectionRange(start, end)
			  ); break;
  		case 'color':
			  that.setState(
			    {color: uppercasedValue},
			    () => input.setSelectionRange(start, end)
			  ); break;
  		case 'dr_number':
			  that.setState(
			    {dr_number: uppercasedValue},
			    () => input.setSelectionRange(start, end)
			  ); break;
  		case 'invoice_number':
			  that.setState(
			    {invoice_number: uppercasedValue},
			    () => input.setSelectionRange(start, end)
			  ); break;
  		case 'price':
  			if(isNaN(inputVal)){
  				return;
  			}else{
	  				that.setState(
					    {price: inputVal > 0 ? uppercasedValue : ''},
					    () => input.setSelectionRange(start, end)
					  );
  			} break;
			default: return false;
	  }
	}
  updateState = (state,value) => {
  	const that = this;
  	let { date_received,dr_date,invoice_date,warranty_booklet,clearances,tba,saveTemplate, }  = this.state;

  	switch(state){
  		case 'warranty_booklet':
  			that.setState({warranty_booklet: !warranty_booklet}); break;
  		case 'clearances':
  			that.setState({clearances: !clearances}); break;
  		case 'tba':
  			that.setState({tba: !tba}); break;
  		case 'saveTemplate':
  			that.setState({saveTemplate: !saveTemplate}); break;
  		default: return false;
  	}
  }

  saveUnit = (saveAndAdd) => {
  	let { date_received,dr_date,invoice_date, } = this.refs;
  	if( (date_received.value) === '' ){
  		toastr.remove();
  		toastr.info("Please enter date received");
  		return;
  	}else{
  		if( isNaN(Date.parse(date_received.value)) ){
	  		toastr.remove();
	  		toastr.info("Please enter a valid date for <br /> Date Received");
	  		return;
  		}
  	}
  	if( (dr_date.value) !== '' ){
  		if( isNaN(Date.parse(dr_date.value)) ){
	  		toastr.remove();
	  		toastr.info("Please enter a valid date for <br /> Delivery Date");
	  		return;
  		}
  	}
  	if( (invoice_date.value) !== '' ){
  		if( isNaN(Date.parse(invoice_date.value)) ){
	  		toastr.remove();
	  		toastr.info("Please enter a valid date for <br /> Invoice Date");
	  		return;
  		}
  	}
  }

	render() {
		let { value,spinnerIsVisible,confirmDeleteShown,noEvent,isOpen,selectedBrand,selectedModel,engine_number,chassis_number,color,date_received,
					selectedBranch,dr_number,dr_date,invoice_number,invoice_date,price,warranty_booklet,clearances,tba,saveTemplate,modelOptions, } = this.state;
		let { loggingOut,brandsSelect,modelsSelect,branchesSelect, } = this.props;
		let table_class_name = noEvent ? "bn-in-stock-table acustom-disabled" : "bn-in-stock-table";
		let brandOptions = brandsSelect.filter((v) => v.value != "all");
		const currentPage = ["Brand New - In Stock","/brand_new_in_stock/"];
		const permission = true;
		return (
			<div>
				<LoggingOut loggingOut={loggingOut} />
				<InventorySidebar history={this.props.history} component="Inventory" />
				<div className="content">
					<NavBar data={this.props} system="Inventory" history={this.props.history} logout={this.logOut}/>
						<ConfirmDelete className="" modal={confirmDeleteShown} callBack={this.deleteFunction} closeModal={this.closeModal} />
						{
							permission ?
							<div>
								<InventorySubSidebar subpage={currentPage[1]} history={this.props.history} />
								<Container className="with-subsidebar" fluid style={{paddingBottom: 50}}>
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
									      		inventory_sublinks.map((link, key) => {
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
									<Row>
										<Breadcrumb>
							        <BreadcrumbItem><a href="#">Inventory</a></BreadcrumbItem>
							        <BreadcrumbItem active>Add Brand New Units</BreadcrumbItem>
							      </Breadcrumb>
									</Row>
									<Row className="page-header">
										<Col>
											<h4>Add Brand New Units </h4>
										</Col>
									</Row>
									<Row>
										<br />
									</Row>
									<Row>
										<Col md="6">
											<FormGroup>
												<label>Brand</label><br />
					          		<Select
					                options={brandOptions}
					                placeholder="Select Brand"
					                value={selectedBrand}
					                onChange={this.handleChangeBrand}
					              />
											</FormGroup>
											<FormGroup>
												<label>Model</label><br />
					          		<Select
					                options={modelOptions}
					                placeholder="Select Model"
					                value={selectedModel}
					                onChange={this.handleChangeModel}
					              />
											</FormGroup>
											<FormGroup>
												<label>Engine Number</label><br />
					          		<Input onChange={(e) => this.changeInput(e,'engine_number')} value={engine_number}/>
											</FormGroup>
											<FormGroup>
												<label>Chassis Number</label><br />
					          		<Input onChange={(e) => this.changeInput(e,'chassis_number')} value={chassis_number}/>
											</FormGroup>
											<FormGroup>
												<label>Color</label><br />
					          		<Input onChange={(e) => this.changeInput(e,'color')} value={color}/>
											</FormGroup>
											<FormGroup>
												<label>Date Received (MM/DD/YYYY)</label><br />
					          		<InputMask className="form-control" mask="99/99/9999" maskplaceholder="MM/DD/YYYY" ref="date_received" />
											</FormGroup>
										</Col>
										<Col md="6">
											<FormGroup>
												<label>Branch</label><br />
					          		<Select
					                options={branchesSelect}
					                placeholder="Select Branch"
					                value={selectedBranch}
					                onChange={this.handleChangeBranch}
					                isDisabled={true}
					              />
					            	{/*<Input value={selectedBranch.label} disabled />*/}
											</FormGroup>
											<FormGroup>
												<label>Delivery Receipt Number</label><br />
					          		<Input onChange={(e) => this.changeInput(e,'dr_number')} value={dr_number}/>
											</FormGroup>
											<FormGroup>
												<label>Delivery Receipt Date (MM/DD/YYYY)</label><br />
					          		<InputMask className="form-control" mask="99/99/9999" maskPlaceholder="MM/DD/YYYY" ref="dr_date" />
											</FormGroup>
											<FormGroup>
												<label>Invoice Number</label><br />
					          		<Input onChange={(e) => this.changeInput(e,'invoice_number')} value={invoice_number}/>
											</FormGroup>
											<FormGroup>
												<label>Invoice Date (MM/DD/YYYY)</label><br />
					          		<InputMask className="form-control" mask="99/99/9999" maskPlaceholder="MM/DD/YYYY" ref="invoice_date" />
											</FormGroup>
											<FormGroup>
												<label>Price</label><br />
					          		<Input onChange={(e) => this.changeInput(e,'price')} value={price} maxLength={15} />
											</FormGroup>
										</Col>
									</Row>
									<Row>
										<Col md="3">
											<FormGroup>
					          		<Button className={warranty_booklet ? "es-main-btn" : ""} size="sm" color={warranty_booklet ? "primary" : "secondary"} onClick={() => this.updateState('warranty_booklet')}><FontAwesomeIcon icon={warranty_booklet ? "check" : "minus"} /></Button>{' '}
												<label className="checkbox-label" onClick={() => this.updateState('warranty_booklet')}>Warranty Booklet</label><br />
											</FormGroup>
										</Col>
										<Col md="3">
											<FormGroup>
					          		<Button className={clearances ? "es-main-btn" : ""} size="sm" color={clearances ? "primary" : "secondary"} onClick={() => this.updateState('clearances')}><FontAwesomeIcon icon={clearances ? "check" : "minus"} /></Button>{' '}
												<label className="checkbox-label" onClick={() => this.updateState('clearances')}>Clearances</label><br />
											</FormGroup>
										</Col>
										<Col md="3">
											<FormGroup>
					          		<Button className={tba ? "es-main-btn" : ""} size="sm" color={tba ? "primary" : "secondary"} onClick={() => this.updateState('tba')}><FontAwesomeIcon icon={tba ? "check" : "minus"} /></Button>{' '}
												<label className="checkbox-label" onClick={() => this.updateState('tba')}>TBA's</label><br />
											</FormGroup>
										</Col>
									</Row>
									<Row>
										<Col md="12">
											<FormGroup>
					          		<Button className={saveTemplate ? "es-main-btn" : ""} size="sm" color={saveTemplate ? "primary" : "secondary"} onClick={() => this.updateState('saveTemplate')}><FontAwesomeIcon icon={saveTemplate ? "check" : "minus"} /></Button>{' '}
												<label className="checkbox-label" onClick={() => this.updateState('saveTemplate')}>Save template for next entry (Except for Chassis and Engine Numbers)</label><br />
											</FormGroup>
										</Col>
									</Row>
									<Row style={{padding: 20}} />
									<Row>
										<Col md="2">
											<FormGroup>
					          		<Button color="danger" block>Cancel</Button>
											</FormGroup>
										</Col>
										<Col />
										<Col md="4">
											<FormGroup>
					          		<Button className="es-main-btn" color="primary" block onClick={() => this.saveUnit(true)}>Save and Add New Entry</Button>
											</FormGroup>
										</Col>
										<Col md="4">
											<FormGroup>
					          		<Button color="primary" block onClick={() => this.saveUnit(false)}>Save and Close</Button>
											</FormGroup>
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
  userData: state.login.userData,
  loggingOut: state.user_auth.loggingOut,
  brandsSelect: state.category.brandsSelect,
  modelsSelect: state.category.modelsSelect,
  branchesSelect: state.category.branchesSelect,
});

function mapDispatchToProps(dispatch) {
   return { actions: bindActionCreators(Object.assign({}, DashboardActions, AuthActions), dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddBrandNewUnit);

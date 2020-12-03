import React from 'react';
//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as AuthActions from 'actions/auth';
import * as UserActions from 'actions/prev/users';
import * as CategoryActions from 'actions/prev/category';

import { Row,Col,Button,Modal,ModalHeader,ModalBody,ModalFooter,FormGroup,Input,UncontrolledPopover,PopoverHeader,PopoverBody, } from 'reactstrap';
import Select from 'react-select';
import toastr from 'toastr';

import { _isEmail,_passwordIsStrong, } from 'helpers/';
const passwordValidationMessage = "Passwords must at least have: <br />- a minimum of 6 characters <br />- 1 uppercased letter <br />- 1 lowercased letter <br />- 1 number <br />";
const tempPassword = "Pass123";

class AddUser extends React.PureComponent {

	constructor(props) {
		super(props);

    this.state = {
      selectedDesignation: '',
      selectedBranch: '',
      fullname: '',
      username: '',
      email: '',
      address: '',
      password: '',
      confirm_pass: '',
      designationList: []
    }
	}
  handleChangeDesignation = (option) => {
    this.setState({selectedDesignation: option});
  }
  handleChangeBranch = (option) => {
    const that = this;
    let { designationSelect } = this.props;
    let filteredDesignation = designationSelect.filter((v) => v.label !== "ADMINISTRATOR");
    that.setState({selectedBranch: option, selectedDesignation: '',branchSelectChanged: true});

    if(option.label === "MAIN"){
      that.setState({designationList: designationSelect});
    }else{
      that.setState({designationList: filteredDesignation});
    }
  }
  modalClosed = () => {
    let { closeModal } = this.props;
    this.setState({
      selectedDesignation: '',
      selectedBranch: '',
      branchSelectChanged: false,
      fullname: '',
      username: '',
      email: '',
      address: '',
      password: '',
      confirm_pass: '',
    });
    closeModal();
  }
  /* set input characters to uppercase */
  handleChangeInputs = (event, type) => {
    const that = this;
    const input = event.target;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    let uppercasedValue = input.value.toUpperCase();

    switch(type){
      case 'fullname':
        this.setState(
          {fullname: uppercasedValue},
          () => input.setSelectionRange(start, end)
        );
      break;
      case 'username':
        this.setState(
          {username: input.value},
          () => input.setSelectionRange(start, end)
        );
      break;
      case 'email':
        this.setState(
          {email: input.value},
          () => input.setSelectionRange(start, end)
        );
      break;
      case 'address':
        this.setState(
          {address: uppercasedValue},
          () => input.setSelectionRange(start, end)
        );
      break;
      case 'password':
        this.setState(
          {password: input.value},
          () => input.setSelectionRange(start, end)
        );
      break;
      case 'confirm_pass':
        this.setState(
          {confirm_pass: input.value},
          () => input.setSelectionRange(start, end)
        );
      break;

      default: return false;
    }
  }

  save = (e) => {
    e.preventDefault();
    const that = this;

    let {
      fullname,
      username,
      email,
      selectedBranch,
      selectedDesignation,
      address,
      password,
      confirm_pass,
    } = this.state;
    let { callBack } = this.props;

    if(fullname.trim() === ''){
      that.setState({fullname: ''});
      toastr.remove();
      toastr.info("Please enter full name");
      return;
    }
    if(username.trim() === ''){
      that.setState({username: ''});
      toastr.remove();
      toastr.info("Please enter username");
      return;
    }
    if(email.trim() === ''){
      that.setState({email: ''});
      toastr.remove();
      toastr.info("Please enter email");
      return;
    }else{
      if(!_isEmail(email)){
        toastr.remove();
        toastr.info("Please use a valid email");
        return;
      }
    }
    if(selectedBranch === ''){
      that.setState({selectedBranch: ''});
      toastr.remove();
      toastr.info("Please select branch");
      return;
    }
    if(selectedDesignation === ''){
      that.setState({selectedDesignation: ''});
      toastr.remove();
      toastr.info("Please select role");
      return;
    }
    // if(address.trim() === ''){
    //   that.setState({address: ''});
    //   toastr.remove();
    //   toastr.info("Please enter address");
    //   return;
    // }
    if(password.trim() === ''){
      that.setState({password: ''});
      toastr.remove();
      toastr.info("Please enter password");
      return;
    }else{
      if(!_passwordIsStrong(password)){
        toastr.remove();
        toastr.error(passwordValidationMessage);
        return;
      }
      if(password === tempPassword){
        toastr.remove();
        toastr.info("Please use another password");
        return;
      }
      if(confirm_pass.trim() === ''){
        that.setState({confirm_pass: ''});
        toastr.remove();
        toastr.info("Please confirm password");
        return;
      }else{
        if(password !== confirm_pass){
          toastr.remove();
          toastr.error("Passwords do not match");
          that.setState({confirm_pass: ''});
          return;
        }else{

        }
      }
    }

    let formData = {
      fullname: fullname,
      username: username,
      email: email,
      branch: selectedBranch.value,
      type: selectedDesignation.value,
      address: address,
      password: password,
    }
    that.props.actions.UsernameOrEmailExists(formData.username,formData.email)
    .then((res) => {
      toastr.remove();
      if(res.status){
        that.props.actions.AddSystemUser(formData)
        .then((response) => {
           if(response.status){
             toastr.success(response.message);
             that.modalClosed();
              callBack();
           }else{
             toastr.error(response.message);
           }
        })
      }else{
        toastr.error(res.message)
      }
    })
  }
  modalOpened = () => {
    let { designationList } = this.state;
    let { designationSelect } = this.props;

    this.setState({designationList: []});
  }
  toggleCallback = () => {
     this.modalClosed(); 
  }
  noOptionsMessage = () => {
    let { branchSelectChanged } = this.state;
    return branchSelectChanged ? "No role available" : "Please select branch first";
  }


	render() {
		let { modal,className,callBack,closeModal,branchSelect,designationSelect } = this.props;
    let { selectedDesignation,selectedBranch,fullname,username,email,address,password,confirm_pass,designationList } = this.state;
		return (
			<Modal isOpen={modal} className={className} backdrop={true} keyboard={false} centered={true} size="lg" onOpened={this.modalOpened} toggle={this.toggleCallback} >
        <form onSubmit={this.save}>
        <ModalHeader>Add System User</ModalHeader>
        <ModalBody>
        	<Row>
          	<Col md="6">
          		<label>Name</label> <br />
          		<Input placeholder="Enter full name" autoComplete="off" onChange={(e) => this.handleChangeInputs(e,'fullname')} value={fullname}/>
          	</Col>
          	<Col md="6">
          		<label>Username</label> <br />
          		<Input placeholder="Enter username" onChange={(e) => this.handleChangeInputs(e,'username')} value={username}/>
          	</Col>
        	</Row>
        	<Row>
          	<Col md="6">
          		<label>Email</label> <br />
          		<Input placeholder="Enter Email" onChange={(e) => this.handleChangeInputs(e,'email')} value={email}/>
          	</Col>
            <Col md="6" className="react-select-wrap">
              <label>Branch</label> <br />
              <Select
                options={branchSelect}
                placeholder="Select Branch"
                value={selectedBranch}
                onChange={this.handleChangeBranch}
              />
            </Col>
        	</Row>
        	<Row>
            <Col md="6" className="react-select-wrap">
              <label>Role</label> <br />
              <Select
                options={designationList}
                noOptionsMessage={this.noOptionsMessage}
                placeholder="Select Role"
                value={selectedDesignation}
                onChange={this.handleChangeDesignation}
              />
            </Col>
          	<Col md="6">
          		<label>Address</label> <br />
          		<Input placeholder="Enter address" onChange={(e) => this.handleChangeInputs(e,'address')} value={address}/>
          	</Col>
        	</Row>
        	<Row>
          	<Col md="6">
          		<label>Password</label> <br />
          		<Input id="PopoverFocus" type="password" placeholder="Enter password" onChange={(e) => this.handleChangeInputs(e,'password')} value={password}/>
              <UncontrolledPopover trigger="focus" placement="top" target="PopoverFocus">
                <PopoverHeader></PopoverHeader>
                <PopoverBody>
                  Passwords must at least have: <br />
                  - 1 uppercased letter <br />
                  - 1 lowercased letter <br />
                  - 1 number <br />
                  - a minimum of 6 characters <br />
                  <br />
                  e.g. <i>{tempPassword}</i>
                </PopoverBody>
              </UncontrolledPopover>
          	</Col>
          	<Col md="6">
          		<label>Confirm Password</label> <br />
          		<Input type="password" placeholder="Confirm password" onChange={(e) => this.handleChangeInputs(e,'confirm_pass')} value={confirm_pass}/>
          	</Col>
        	</Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.modalClosed}>Cancel</Button>{' '}
          <Button color="primary" className="es-main-btn">Save</Button>
        </ModalFooter>
        </form>
      </Modal>
		);
	}
}

const mapStateToProps = state => ({
  authenticated: state.user_auth.authenticated,
  loggingIn: state.user_auth.loggingIn,
  branchSelect: state.category.branchesSelect,
  designationSelect: state.users.designationList,
});

function mapDispatchToProps(dispatch) {
   return { actions: bindActionCreators(Object.assign({}, AuthActions,UserActions,CategoryActions, ), dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddUser);

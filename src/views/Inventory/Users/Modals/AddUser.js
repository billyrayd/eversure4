import React from 'react';
//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as AuthActions from 'actions/auth';
import * as UserActions from 'actions/prev/users';
import * as CategoryActions from 'actions/prev/category';

import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input } from 'reactstrap';
import Select from 'react-select';

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
    }
	}

  handleChangeDesignation = (option) => {
    this.setState({selectedDesignation: option})
  }
  handleChangeBranch = (option) => {
    this.setState({selectedBranch: option})
  }
  modalClosed = () => {
    let { closeModal } = this.props;
    this.setState({selectedDesignation: '',selectedBranch: ''});
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

	render() {
		let { modal,className,callBack,closeModal,branchSelect,designationSelect } = this.props;
    let { selectedDesignation,selectedBranch,fullname,username,email,address,password,confirm_pass, } = this.state;
		return (
			<Modal isOpen={modal} className={className} backdrop={true} keyboard={false} centered={true} size="lg">
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
                options={designationSelect}
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
          		<Input type="password" placeholder="Enter password" onChange={(e) => this.handleChangeInputs(e,'password')} value={password}/>
          	</Col>
          	<Col md="6">
          		<label>Confirm Password</label> <br />
          		<Input type="password" placeholder="Confirm password" onChange={(e) => this.handleChangeInputs(e,'confirm_pass')} value={confirm_pass}/>
          	</Col>
        	</Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.modalClosed}>Cancel</Button>{' '}
          <Button color="primary" className="es-main-btn" onClick={callBack}>Save</Button>
        </ModalFooter>
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

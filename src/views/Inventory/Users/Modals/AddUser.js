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

	render() {
		let { modal,className,callBack,closeModal,branchSelect,designationSelect } = this.props;
    let { selectedDesignation,selectedBranch, } = this.state;
		return (
			<Modal isOpen={modal} className={className} backdrop={true} keyboard={false} centered={true} size="lg">
        <ModalHeader>Add System User</ModalHeader>
        <ModalBody>
        	<Row>
          	<Col md="6">
          		<label>Name</label> <br />
          		<Input placeholder="Enter full name" autoComplete="off" />
          	</Col>
          	<Col md="6">
          		<label>Username</label> <br />
          		<Input placeholder="Enter username" />
          	</Col>
        	</Row>
        	<Row>
          	<Col md="6">
          		<label>Email</label> <br />
          		<Input placeholder="Enter Email" />
          	</Col>
          	<Col md="6" className="react-select-wrap">
          		<label>Role</label> <br />
          		<Select
                options={designationSelect}
                placeholder="Select Position/Designation"
                value={selectedDesignation}
                onChange={this.handleChangeDesignation}
              />
          	</Col>
        	</Row>
        	<Row>
          	<Col md="6" className="react-select-wrap">
          		<label>Branch</label> <br />
              <Select
                options={branchSelect}
                placeholder="Select Branch"
                value={selectedBranch}
                onChange={this.handleChangeBranch}
              />
          	</Col>
          	<Col md="6">
          		<label>Address</label> <br />
          		<Input placeholder="Enter address" />
          	</Col>
        	</Row>
        	<Row>
          	<Col md="6">
          		<label>Password</label> <br />
          		<Input type="password" placeholder="Enter password" />
          	</Col>
          	<Col md="6">
          		<label>Confirm Password</label> <br />
          		<Input type="password" placeholder="Confirm password" />
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

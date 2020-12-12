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

class ViewUser extends React.PureComponent {

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
  modalOpened = () => {
    let { data } = this.props;

    this.setState({selectedDesignation: data.user_position_info.position_type,selectedBranch: data.branch_info.branch_name,fullname: data.fullname,username: data.username,email: data.email,address: data.address})
  }
  toggleCallback = () => {
    let { closeModal } = this.props;
    closeModal(); 
  }
  noOptionsMessage = () => {
    let { branchSelectChanged } = this.state;
    return branchSelectChanged ? "No role available" : "Please select branch first";
  }

	render() {
		let { modal,className,callBack,closeModal,branchSelect,designationSelect,data } = this.props;
    let { selectedDesignation,selectedBranch,fullname,username,email,address,designationList } = this.state;
		return (
			<Modal isOpen={modal} className={className} backdrop={"static"} keyboard={true} centered={true} size="lg" onOpened={this.modalOpened} toggle={this.toggleCallback} >
        <ModalHeader>User Details</ModalHeader>
        <ModalBody>
        	<Row style={{marginBottom: 20}}>
          	<Col md="6">
          		<label>Name</label> <br />
          		<h5 style={{marginLeft: 10}}>{fullname}</h5>
          	</Col>
          	<Col md="6">
          		<label>Username</label> <br />
              <h5 style={{marginLeft: 10}}>{username}</h5>
          	</Col>
        	</Row>
          <Row style={{marginBottom: 20}}>
          	<Col md="6">
          		<label>Email</label> <br />
              <h5 style={{marginLeft: 10}}>{email}</h5>
          	</Col>
            <Col md="6" className="react-select-wrap">
              <label>Branch</label> <br />
              <h5 style={{marginLeft: 10}}>{selectedBranch}</h5>
            </Col>
        	</Row>
          <Row style={{marginBottom: 20}}>
            <Col md="6" className="react-select-wrap">
              <label>Role</label> <br />
              <h5 style={{marginLeft: 10}}>{selectedDesignation}</h5>
            </Col>
          	<Col md="6">
          		<label>Address</label> <br />
              <h5 style={{marginLeft: 10}}>{address}</h5>
          	</Col>
        	</Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => closeModal()}>Close</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewUser);

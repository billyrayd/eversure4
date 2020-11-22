import React from 'react';
//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as AuthActions from 'actions/auth';
import * as UserActions from 'actions/prev/users';

import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input } from 'reactstrap';
import toastr from 'toastr';

class AddPermission extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      group: '',
      permission: '',
      page: '',
      systemType: '',
    }
  }

  save = () => {
    const that = this;
    let { group,permission,page,systemType } = this.state;
    let { callBack } = this.props;
    if(group.trim() === ""){
      that.setState({group: ''});
      toastr.remove();
      toastr.info("Please enter permission group name");
    }else if(permission.trim() === ""){
      that.setState({permission: ''});
      toastr.remove();
      toastr.info("Please enter permission name");
    }else if(page.trim() === ""){
      that.setState({permission: ''});
      toastr.remove();
      toastr.info("Please enter page name");
    }else{
      this.props.actions.AddUserPermission(group,permission,page,systemType)
      .then((res) => {
        toastr.remove();
        if(res.status){
            toastr.success(res.message);
            that.modalClosed();
            callBack();
        }else{
          that.setState({group: '',permission: '',page: '',systemType: ''});
          toastr.error(res.message);
        }
      })
    }
  }
  changeGroup = (event) => {
    const input = event.target;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    let uppercasedValue = input.value.toUpperCase();

    this.setState(
      {group: input.value},
      () => input.setSelectionRange(start, end)
    );
  }
  changePermission = (event) => {
    const input = event.target;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    let uppercasedValue = input.value.toUpperCase();

    this.setState(
      {permission: input.value},
      () => input.setSelectionRange(start, end)
    );
  }
  /* set input characters to uppercase */
  changePage = (event) => {
    const input = event.target;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    let uppercasedValue = input.value.toUpperCase();

    this.setState(
      {page: uppercasedValue},
      () => input.setSelectionRange(start, end)
    );
  }
  /* set input characters to uppercase */
  changeSystemType = (event) => {
    const input = event.target;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    let uppercasedValue = input.value.toUpperCase();

    this.setState(
      {systemType: uppercasedValue},
      () => input.setSelectionRange(start, end)
    );
  }
  modalClosed = () => {
    let { closeModal } = this.props;
    this.setState({group: '',permission: '',page: '',systemType: ''});
    closeModal();
  }
  submitForm = (e) => {
    const that = this;
    if (e.key === 'Enter') {
        e.target.blur(); // hide virtual keyboard on mobile devices
        that.save();
    }
  }
  toggleCallback = () => {
    let { toggle } = this.props;

    this.modalClosed();
  }

  render() {
    let { modal,className,callBack,closeModal } = this.props;
    let { group,permission,page,systemType } = this.state;
    return (
      <Modal isOpen={modal} className={className} backdrop={true} centered={true} toggle={this.toggleCallback}>
        <ModalHeader>Add User Permision</ModalHeader>
        <ModalBody>
          <Row>
            <Col md="12">
              <label>System Type</label> <br />
              <Input placeholder="Enter System Type" autoComplete="off" onChange={(e) => this.changeSystemType(e)} value={systemType} onKeyPress={(e) => this.submitForm(e)} />
            </Col>
            <Col md="12">
              <label>Permission Group Name</label> <br />
              <Input placeholder="Enter Permission Group Name" autoComplete="off" onChange={(e) => this.changeGroup(e)} value={group} onKeyPress={(e) => this.submitForm(e)} />
            </Col>
            <Col md="12">
              <label>Permission Name</label> <br />
              <Input placeholder="Enter Permission Name" autoComplete="off" onChange={(e) => this.changePermission(e)} value={permission} onKeyPress={(e) => this.submitForm(e)} />
            </Col>
            <Col md="12">
              <label>Page Name</label> <br />
              <Input placeholder="Enter Permission Name" autoComplete="off" onChange={(e) => this.changePage(e)} value={page} onKeyPress={(e) => this.submitForm(e)} />
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.modalClosed}>Cancel</Button>{' '}
          <Button color="primary" className="es-main-btn" onClick={this.save}>Save</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  authenticated: state.user_auth.authenticated,
  loggingIn: state.user_auth.loggingIn,
  loggingOut: state.user_auth.loggingOut,
});

function mapDispatchToProps(dispatch) {
   return { actions: bindActionCreators(Object.assign({}, AuthActions,UserActions,), dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddPermission);

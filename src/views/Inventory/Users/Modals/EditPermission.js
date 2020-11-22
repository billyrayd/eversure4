import React from 'react';
//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as AuthActions from 'actions/auth';
import * as UserActions from 'actions/prev/users';

import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input } from 'reactstrap';
import toastr from 'toastr';

class EditPermission extends React.PureComponent {

	constructor(props) {
		super(props);

    this.state = {
      group: '',
      permission: '',
      page: '',
      systemType: ''
    }
	}

  save = () => {
    const that = this;
    let { group,permission,page,systemType, } = this.state;
    let { callBack,data } = this.props;

    if(group.trim() === "" && permission.trim() === "" && page.trim() === "" && systemType.trim() === ""){
      that.setState({group: '',permission: '',page: '',systemType: ''});
      toastr.remove();
      toastr.info("No changes made");
    }else{
      if(group == data[1]){
        toastr.info("No changes made");
      }else if(permission == data[2]){
        toastr.info("No changes made");
      }else{
        this.props.actions.UpdatePermission(data[0],group,permission,page,systemType)
        .then((res) => {
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
  }
  changeGroup = (event) => {
    const input = event.target;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    let uppercasedValue = input.value.toUpperCase()

    this.setState(
      {group: input.value},
      () => input.setSelectionRange(start, end)
    );
  }
  changePermission = (event) => {
    const input = event.target;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    let uppercasedValue = input.value.toUpperCase()

    this.setState(
      {permission: input.value},
      () => input.setSelectionRange(start, end)
    );
  }
  changePage = (event) => {
    const input = event.target;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    let uppercasedValue = input.value.toUpperCase()

    this.setState(
      {page: uppercasedValue},
      () => input.setSelectionRange(start, end)
    );
  }
  changeSystemType = (event) => {
    const input = event.target;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    let uppercasedValue = input.value.toUpperCase()

    this.setState(
      {systemType: uppercasedValue},
      () => input.setSelectionRange(start, end)
    );
  }
  modalClosed = () => {
    let { closeModal } = this.props;
    this.setState({group: '', permission: '',page: '',systemType: ''});
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
    this.modalClosed();
  }

	render() {
		let { modal,className,callBack,closeModal,data } = this.props;
    let { group,permission,page,systemType, } = this.state;
		return (
			<Modal isOpen={modal} className={className} toggle={this.toggleCallback} backdrop={true} keyboard={true} centered={true}>
        <ModalHeader>Edit Permission</ModalHeader>
        <ModalBody>
        	<Row>
            <Col md="12">
              <label>System type</label> <br />
              <Input autoComplete="off" placeholder={data[4]} onChange={(e) => this.changeSystemType(e)} value={systemType} onKeyPress={(e) => this.submitForm(e)} />
            </Col>
          	<Col md="12">
          		<label>Permission Group Name</label> <br />
          		<Input autoComplete="off" placeholder={data[1]} onChange={(e) => this.changeGroup(e)} value={group} onKeyPress={(e) => this.submitForm(e)} />
          	</Col>
            <Col md="12">
              <label>Permissions Name</label> <br />
              <Input autoComplete="off" placeholder={data[2]} onChange={(e) => this.changePermission(e)} value={permission} onKeyPress={(e) => this.submitForm(e)} />
            </Col>
            <Col md="12">
              <label>Page Name</label> <br />
              <Input autoComplete="off" placeholder={data[3]} onChange={(e) => this.changePage(e)} value={page} onKeyPress={(e) => this.submitForm(e)} />
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

export default connect(mapStateToProps, mapDispatchToProps)(EditPermission);
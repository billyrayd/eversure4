import React from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input } from 'reactstrap';
import toastr from 'toastr';

export default class AddArea extends React.PureComponent {

	constructor(props) {
		super(props);

    this.state = {
      role: ''
    }
	}

  save = () => {
    const that = this;
    let { role } = this.state;
    let { callBack } = this.props;
    if(role.trim() === ""){
      that.setState({role: ''});
      toastr.remove();
      toastr.info("Please enter role name");
    }else{
      this.props.actions.AddUserRole(role)
      .then((res) => {
        toastr.remove();
        if(res.status){
            toastr.success(res.message);
            that.modalClosed();
            callBack();
        }else{
          that.setState({role: ''});
          toastr.error(res.message);
        }
      })
    }
  }
  /* set input characters to uppercase */
  handleChange = (event) => {
    const input = event.target;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    let uppercasedValue = input.value.toUpperCase()

    this.setState(
      {role: uppercasedValue},
      () => input.setSelectionRange(start, end)
    );
  }
  modalClosed = () => {
    let { closeModal } = this.props;
    this.setState({role: ''});
    closeModal();
  }
  submitForm = (e) => {
    const that = this;
    if (e.key === 'Enter') {
        e.target.blur(); // hide virtual keyboard on mobile devices
        that.save();
    }
  }

	render() {
		let { modal,className,callBack,closeModal } = this.props;
    let { role } = this.state;
		return (
			<Modal isOpen={modal} className={className} backdrop={true} keyboard={false} centered={true}>
        <ModalHeader>Add User Role</ModalHeader>
        <ModalBody>
        	<Row>
          	<Col md="12">
          		<label>Role Name</label> <br />
          		<Input placeholder="Enter Role Name" autoComplete="off" onChange={(e) => this.handleChange(e)} value={role} onKeyPress={(e) => this.submitForm(e)} />
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

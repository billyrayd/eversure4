import React from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input } from 'reactstrap';
import toastr from 'toastr';

export default class DeleteBranch extends React.PureComponent {

	constructor(props) {
		super(props);

    this.state = {
      branch: ''
    }
	}

  delete = () => {
    const that = this;
    let { branch } = this.state;
    let { callBack,closeModal,data } = this.props;

    that.props.actions.DeleteBranch(data[0])
    .then((res) => {
      toastr.remove();
      if(res){
        toastr.success("Branch successfully deleted");
      }else{
        toastr.error("Failed to delete branch");
      }
      callBack();
      closeModal();
    })
    
  }
  /* set input characters to uppercase */
  handleChange = (event) => {
    const input = event.target;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    let uppercasedValue = input.value.toUpperCase()

    this.setState(
      {branch: uppercasedValue},
      () => input.setSelectionRange(start, end)
    );
  }
  modalClosed = () => {
    let { closeModal } = this.props;
    this.setState({branch: ''});
    closeModal();
  }

	render() {
		let { modal,className,callBack,closeModal } = this.props;
    let { branch } = this.state;
		return (
			<Modal isOpen={modal} className={className} backdrop={true} keyboard={false}>
        <ModalHeader>Delete Branch</ModalHeader>
        <ModalBody>
        	<Row>
          	<Col md="12">
          		<label>Are you sure you want to delete this branch?</label> <br />
              <b>{this.props.data[1] || ''}</b>
          	</Col>
        	</Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.modalClosed}>Cancel</Button>{' '}
          <Button color="danger" onClick={this.delete}>Delete</Button>
        </ModalFooter>
      </Modal>
		);
	}
}

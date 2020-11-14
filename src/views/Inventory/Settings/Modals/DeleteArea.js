import React from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input } from 'reactstrap';
import toastr from 'toastr';

export default class DeleteArea extends React.PureComponent {

	constructor(props) {
		super(props);

    this.state = {}
	}

  delete = () => {
    const that = this;
    let { brand } = this.state;
    let { callBack,closeModal,data } = this.props;

    that.props.actions.DeleteArea(data[0])
    .then((res) => {
      toastr.remove();
      if(res){
        toastr.success("Customer area successfully deleted");
      }else{
        toastr.error("Failed to delete area");
      }
      callBack();
      closeModal();
    })
    
  }
  modalClosed = () => {
    let { closeModal } = this.props;
    closeModal();
  }
  toggleCallback = () => {
    let { toggle } = this.props;

    toggle();
  }

	render() {
		let { modal,className,callBack,closeModal,onOpened, } = this.props;
		return (
			<Modal isOpen={modal} className={className} toggle={this.toggleCallback} backdrop={true} centered={true} onOpened={onOpened}>
        <ModalHeader>Delete Customer Area</ModalHeader>
        <ModalBody>
        	<Row>
          	<Col md="12">
          		<label>Are you sure you want to delete this area?</label> <br />
              <b>{this.props.data[1] || ''}</b>
          	</Col>
        	</Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.modalClosed}>Cancel</Button>{' '}
          <Button id="delete" color="danger" onClick={this.delete}>Delete</Button>
        </ModalFooter>
      </Modal>
		);
	}
}

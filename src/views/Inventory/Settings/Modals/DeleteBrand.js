import React from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input } from 'reactstrap';
import toastr from 'toastr';

export default class DeleteBrand extends React.PureComponent {

	constructor(props) {
		super(props);

    this.state = {
      brand: ''
    }
	}

  delete = () => {
    const that = this;
    let { brand } = this.state;
    let { callBack,closeModal,data } = this.props;

    that.props.actions.DeleteBrand(data[0])
    .then((res) => {
      toastr.remove();
      if(res){
        toastr.success("Brand successfully deleted");
      }else{
        toastr.error("Failed to delete brand");
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
      {brand: uppercasedValue},
      () => input.setSelectionRange(start, end)
    );
  }
  modalClosed = () => {
    let { closeModal } = this.props;
    this.setState({brand: ''});
    closeModal();
  }

	render() {
		let { modal,className,callBack,closeModal } = this.props;
    let { brand } = this.state;
		return (
			<Modal isOpen={modal} className={className} backdrop={true} keyboard={false} centered={true}>
        <ModalHeader>Delete Brand</ModalHeader>
        <ModalBody>
        	<Row>
          	<Col md="12">
          		<label>Are you sure you want to delete this brand?</label> <br />
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

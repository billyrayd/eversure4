import React from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input } from 'reactstrap';
import toastr from 'toastr';

export default class DeleteModel extends React.PureComponent {

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


    that.props.actions.ModelNotInUse(data[0])
    .then((cond) => {
      if(cond.status){
        that.props.actions.DeleteModel(data[0])
        .then((res) => {
          toastr.remove();
          if(res){
            toastr.success("Model successfully deleted");
          }else{
            toastr.error("Failed to delete model");
          }
          callBack();
          closeModal();
        })
      }else{
        toastr.remove();
        toastr.error(cond.message);
      }
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
  toggleCallback = () => {
    let { toggle } = this.props;

    toggle();
  }

	render() {
		let { modal,className,callBack,closeModal,onOpened, } = this.props;
    let { brand } = this.state;
		return (
			<Modal isOpen={modal} className={className} toggle={this.toggleCallback} backdrop={true} centered={true} onOpened={onOpened}>
        <ModalHeader>Delete Model</ModalHeader>
        <ModalBody>
        	<Row>
          	<Col md="12">
          		<label>Are you sure you want to delete this model?</label> <br />
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

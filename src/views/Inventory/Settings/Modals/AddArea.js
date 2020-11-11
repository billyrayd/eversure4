import React from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input } from 'reactstrap';
import toastr from 'toastr';

export default class AddArea extends React.PureComponent {

	constructor(props) {
		super(props);

    this.state = {
      area: ''
    }
	}

  save = () => {
    const that = this;
    let { area } = this.state;
    let { callBack } = this.props;
    if(area.trim() === ""){
      that.setState({area: ''});
      toastr.remove();
      toastr.info("Please enter area name");
    }else{
      this.props.actions.AddArea(area)
      .then((res) => {
        toastr.remove();
        if(res.status){
            toastr.success(res.message);
            that.modalClosed();
            callBack();
        }else{
          that.setState({area: ''});
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
      {area: uppercasedValue},
      () => input.setSelectionRange(start, end)
    );
  }
  modalClosed = () => {
    let { closeModal } = this.props;
    this.setState({area: ''});
    closeModal();
  }

	render() {
		let { modal,className,callBack,closeModal } = this.props;
    let { area } = this.state;
		return (
			<Modal isOpen={modal} className={className} backdrop={true} keyboard={false}>
        <ModalHeader>Add Area</ModalHeader>
        <ModalBody>
        	<Row>
          	<Col md="12">
          		<label>Area Name</label> <br />
          		<Input placeholder="Enter Area Name" autoComplete="off" onChange={(e) => this.handleChange(e)} value={area} />
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

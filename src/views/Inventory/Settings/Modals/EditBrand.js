import React from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input } from 'reactstrap';
import toastr from 'toastr';

export default class EditBrand extends React.PureComponent {

	constructor(props) {
		super(props);

    this.state = {
      brandValue: ''
    }
	}

  save = () => {
    const that = this;
    let { brandValue } = this.state;
    let { callBack,data } = this.props;

    if(brandValue.trim() === ""){
      that.setState({brandValue: ''});
      toastr.remove();
      toastr.info("Please enter brand name");
    }else{
      this.props.actions.UpdateBrand(data[0],brandValue)
      .then((res) => {
        if(res.status){
            toastr.success(res.message);
            that.modalClosed();
            callBack();
        }else{
          that.setState({brandValue: ''});
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
      {brandValue: uppercasedValue},
      () => input.setSelectionRange(start, end)
    );
  }
  modalClosed = () => {
    let { closeModal } = this.props;
    this.setState({brandValue: ''});
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
    this.setState({brandValue: ''});

    toggle();
  }

	render() {
		let { modal,className,callBack,closeModal, data } = this.props;
    let { brandValue } = this.state;
		return (
			<Modal isOpen={modal} className={className} toggle={this.toggleCallback} backdrop={true} centered={true}>
        <ModalHeader>Edit Brand</ModalHeader>
        <ModalBody>
        	<Row>
          	<Col md="12">
          		<label>Brand Name</label> <br />
          		<Input placeholder="Enter Brand Name" autoComplete="off" placeholder={data[1]} onChange={(e) => this.handleChange(e)} value={brandValue} onKeyPress={(e) => this.submitForm(e)} />
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

import React from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input } from 'reactstrap';
import toastr from 'toastr';

export default class AddBrand extends React.PureComponent {

	constructor(props) {
		super(props);

    this.state = {
      brand: ''
    }
	}

  save = () => {
    const that = this;
    let { brand } = this.state;
    let { callBack } = this.props;
    if(brand.trim() === ""){
      that.setState({brand: ''});
      toastr.remove();
      toastr.info("Please enter brand name");
    }else{
      this.props.actions.AddBrand(brand)
      .then((res) => {
        if(res.status){
            toastr.success(res.message);
            that.modalClosed();
            callBack();
        }else{
          that.setState({brand: ''});
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
			<Modal isOpen={modal} className={className} backdrop={true} keyboard={false}>
        <ModalHeader>Add Brand</ModalHeader>
        <ModalBody>
        	<Row>
          	<Col md="12">
          		<label>Brand Name</label> <br />
          		<Input placeholder="Enter Brand Name" autoComplete="off" onChange={(e) => this.handleChange(e)} value={brand} />
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

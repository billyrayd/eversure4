import React from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input } from 'reactstrap';
import toastr from 'toastr';

export default class EditArea extends React.PureComponent {

	constructor(props) {
		super(props);

    this.state = {
      area: ''
    }
	}

  save = () => {
    const that = this;
    let { area } = this.state;
    let { callBack,data } = this.props;

    if(area.trim() === ""){
      that.setState({area: ''});
      toastr.remove();
      toastr.info("Please enter area name");
    }else{
      if(area == data[1]){
        toastr.info("No changes made");
      }else{
        this.props.actions.UpdateArea(data[0],area)
        .then((res) => {
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
  submitForm = (e) => {
    const that = this;
    if (e.key === 'Enter') {
        e.target.blur(); // hide virtual keyboard on mobile devices
        that.save();
    }
  }
  toggleCallback = () => {
    let { toggle } = this.props;
    this.setState({area: ''});

    toggle();
  }
  onOpened = () => {
    let { data } = this.props;
    this.setState({area: data[1]});
  }

	render() {
		let { modal,className,callBack,closeModal,data } = this.props;
    let { area } = this.state;
		return (
			<Modal isOpen={modal} className={className} toggle={this.toggleCallback} backdrop={true} keyboard={true} centered={true} onOpened={this.onOpened} >
        <ModalHeader>Edit Customer Area</ModalHeader>
        <ModalBody>
        	<Row>
          	<Col md="12">
          		<label>Customer Area Name</label> <br />
          		<Input autoComplete="off" placeholder={data[1]} onChange={(e) => this.handleChange(e)} value={area} onKeyPress={(e) => this.submitForm(e)} />
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

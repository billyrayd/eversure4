import React from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input } from 'reactstrap';
import toastr from 'toastr';

export default class SelectUnitType extends React.PureComponent {

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
  modalClosed = () => {
    let { closeModal } = this.props;
    this.setState({area: ''});
    closeModal();
  }
  toggleCallback = () => {
    let { toggle } = this.props;
    this.setState({branch: ''});

    toggle();
  }

	render() {
		let { modal,className,callBack,closeModal } = this.props;
    let { area } = this.state;
		return (
			<Modal isOpen={modal} className={className} toggle={this.toggleCallback} backdrop={true} centered={true}>
        <ModalHeader>Select Unit Type</ModalHeader>
        <ModalBody>
        	<Row>
        		<Col sm={{size: 8, offset: 2}} className="btn-wrap">
	          	<Col md="12">
	          		<Button color="primary" size="lg" block>Brand New</Button>
	          	</Col>
	          	<Col md="12">
	          		<h5 style={{textAlign: 'center'}}>or</h5>
	          	</Col>
	          	<Col md="12">
	          		<Button color="primary" size="lg" block>Secondhand</Button>
	          	</Col>
        		</Col>
        	</Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.modalClosed}>Cancel</Button>
        </ModalFooter>
      </Modal>
		);
	}
}

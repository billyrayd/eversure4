import React from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input } from 'reactstrap';
import toastr from 'toastr';

export default class AddPayment extends React.PureComponent {

	constructor(props) {
		super(props);

    this.state = {
      supplier_name: '',
      supplier_receipt: '',
      amount: '',
      date_paid: '',
      remarks: '',
    }
	}

  save = () => {
    const that = this;
    let { branch } = this.state;
    let { callBack } = this.props;
    if(branch.trim() === ""){
      that.setState({branch: ''});
      toastr.remove();
      toastr.info("Please enter branch name");
    }else{
      this.props.actions.AddBranch(branch)
      .then((res) => {
        if(res){
          if(res == "exist"){
            toastr.error(`The branch ${branch} already exists.`);
            that.setState({branch: ''});
          }else{
            toastr.success("Branch successfully added!");
            that.modalClosed();
            callBack();
          }
        }else{
          toastr.error("Failed to add branch. Please try again");
        }
      })
    }
  }
  /* set input characters to uppercase */
  handleChange = (event, supplier_name) => {
    const input = event.target;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    let uppercasedValue = input.value.toUpperCase()

    this.setState(
      {supplier_name: uppercasedValue},
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
    let { supplier_name,supplier_receipt,amount,date_paid,remarks } = this.state;
		return (
			<Modal isOpen={modal} className={className} backdrop={true} keyboard={false}>
        <ModalHeader>Add Payment</ModalHeader>
        <ModalBody>
        	<Row>
          	<Col md="12">
          		<label>Supplier Name</label> <br />
          		<Input placeholder="Enter Supplier Name" autoComplete="off" onChange={(e) => this.handleChange(e, "supplier_name")} value={supplier_name} />
          	</Col>
            <Col md="12">
              <label>Supplier Receipt</label> <br />
              <Input placeholder="Enter Supplier Receipt" autoComplete="off" onChange={(e) => this.handleChange(e)} value={supplier_receipt} />
            </Col>
            <Col md="12">
              <label>Amount</label> <br />
              <Input placeholder="Enter Amount" autoComplete="off" onChange={(e) => this.handleChange(e)} value={amount} />
            </Col>
            <Col md="12">
              <label>Date Paid</label> <br />
              <Input placeholder="Enter Date Paid" autoComplete="off" onChange={(e) => this.handleChange(e)} value={date_paid} />
            </Col>
            <Col md="12">
              <label>Remarks</label> <br />
              <Input placeholder="Enter Remarks" autoComplete="off" onChange={(e) => this.handleChange(e)} value={remarks} />
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

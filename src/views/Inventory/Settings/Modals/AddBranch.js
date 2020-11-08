import React from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input } from 'reactstrap';
import toastr from 'toastr';

export default class AddBranch extends React.PureComponent {

	constructor(props) {
		super(props);

    this.state = {
      branch: ''
    }
	}

  save = () => {
    const that = this;
    let { branch } = this.state;
    let { callBack } = this.props;
    if(branch === ""){
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
        <ModalHeader>Add Branch</ModalHeader>
        <ModalBody>
        	<Row>
          	<Col md="12">
          		<label>Branch Name</label> <br />
          		<Input placeholder="Enter Branch Name" autoComplete="off" onChange={(e) => this.handleChange(e)} value={branch} />
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

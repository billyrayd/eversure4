import React from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input } from 'reactstrap';
import toastr from 'toastr';

export default class EditBranch extends React.PureComponent {

	constructor(props) {
		super(props);

    this.state = {
      branch: ''
    }
	}

  componentDidMount(){
    this.setState({branch: ''})
  }

  save = () => {
    const that = this;
    let { branch } = this.state;
    let { callBack,data } = this.props;

    if(branch.trim() === ""){
      that.setState({branch: ''});
      toastr.remove();
      toastr.info("Please enter branch name");
    }else{
      if(branch == data[1]){
        toastr.info("No changes made");
      }else{
        this.props.actions.UpdateBranch(data[0],branch)
        .then((res) => {
          if(res.status){
              toastr.success(res.message);
              that.modalClosed();
              callBack();
          }else{
            that.setState({branch: ''});
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
      {branch: uppercasedValue},
      () => input.setSelectionRange(start, end)
    );
  }
  modalClosed = () => {
    let { closeModal } = this.props;
    this.setState({branch: ''});
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
    this.setState({branch: ''});

    toggle();
  }

	render() {
		let { modal,className,callBack,closeModal,toggle,data } = this.props;
    let { branch } = this.state;
		return (
			<Modal isOpen={modal} className={className} toggle={this.toggleCallback} backdrop={true} keyboard={true}>
        <ModalHeader>Edit Branch</ModalHeader>
        <ModalBody>
        	<Row>
          	<Col md="12">
          		<label>Branch Name</label> <br />
          		<Input autoComplete="off" placeholder={data[1]} onChange={(e) => this.handleChange(e)} value={branch} onKeyPress={(e) => this.submitForm(e)} />
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

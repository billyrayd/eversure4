import React from 'react';
//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as AuthActions from 'actions/auth';

import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input } from 'reactstrap';
import Select from 'react-select'
import toastr from 'toastr';

class AddModel extends React.PureComponent {

	constructor(props) {
		super(props);

    this.state = {
      model: '',
      selectedBrand: ''
    }
	}

  save = () => {
    const that = this;
    let { model,selectedBrand } = this.state;
    let { callBack } = this.props;

    if(selectedBrand === ""){
      toastr.remove();
      toastr.info("Please select brand");
    }
    else if(model.trim() === ""){
      that.setState({model: ''});
      toastr.remove();
      toastr.info("Please enter model name");
    }
    else{
      // this.props.actions.AddBrand(brand)
      // .then((res) => {
      //   toastr.remove();
      //   if(res.status){
      //       toastr.success(res.message);
      //       that.modalClosed();
      //       callBack();
      //   }else{
      //     that.setState({brand: ''});
      //     toastr.error(res.message);
      //   }
      // })
    }
  }
  /* set input characters to uppercase */
  handleChange = (event) => {
    const input = event.target;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    let uppercasedValue = input.value.toUpperCase()

    this.setState(
      {model: uppercasedValue},
      () => input.setSelectionRange(start, end)
    );
  }
  modalClosed = () => {
    let { closeModal } = this.props;
    this.setState({model: '', selectedBrand: ''});
    closeModal();
  }
  handleChangeBrand = (option) => {
    this.setState({selectedBrand: option})
  }

	render() {
		let { modal,className,callBack,closeModal,brandsSelect } = this.props;
    let { model } = this.state;

    let brandOptions = brandsSelect.filter((v) => v.value != "all");

		return (
			<Modal isOpen={modal} className={className} backdrop={true} keyboard={false}>
        <ModalHeader>Add Model</ModalHeader>
        <ModalBody>
        	<Row>
          	<Col md="12">
          		<label>Brand Name</label> <br />
          		<Select
                options={brandOptions}
                placeholder="Select Brand"
                onChange={this.handleChangeBrand}
              />
          	</Col>
            <Col md="12">
              <label>Model Name</label> <br />
              <Input placeholder="Enter Model Name" autoComplete="off" onChange={(e) => this.handleChange(e)} value={model} />
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

const mapStateToProps = state => ({
  authenticated: state.user_auth.authenticated,
  loggingIn: state.user_auth.loggingIn,
  brandsSelect: state.category.brandsSelect,
});

function mapDispatchToProps(dispatch) {
   return { actions: bindActionCreators(Object.assign({}, AuthActions, ), dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddModel);

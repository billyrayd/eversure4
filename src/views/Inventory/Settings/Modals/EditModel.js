import React from 'react';
//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as AuthActions from 'actions/auth';
import * as CategoryActions from 'actions/prev/category';

import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input } from 'reactstrap';
import toastr from 'toastr';
import Select from 'react-select';

class EditModel extends React.PureComponent {

	constructor(props) {
		super(props);

    this.state = {
      model: '',
      selectedBrand: '',
      selectedBrandChanged: false,
    }
	}

  componentDidMount(){
    this.setState({branch: ''})
  }

  save = () => {
    const that = this;
    let { model,selectedBrand,selectedBrandChanged, } = this.state;
    let { callBack,data } = this.props;

    if(model.trim() === ""){
      that.setState({model: ''});
      toastr.remove();
      toastr.info("Please enter model name");
    }else{
      if(selectedBrandChanged){
        if(model == data[1] && selectedBrand.value == data[2].value){
          toastr.remove();
          toastr.info("No changes made");
        }else{
          this.props.actions.UpdateModel(data[0],model,data[2].value)
          .then((res) => {
            if(res.status){
                toastr.success(res.message);
                that.modalClosed();
                callBack();
            }else{
              that.setState({model: ''});
              toastr.error(res.message);
            }
          })
        }
      }else{
        if(model == data[1]){
          toastr.remove();
          toastr.info("No changes made");
        }else{
          this.props.actions.UpdateModel(data[0],model,data[2].value)
          .then((res) => {
            if(res.status){
                toastr.success(res.message);
                that.modalClosed();
                callBack();
            }else{
              that.setState({model: ''});
              toastr.error(res.message);
            }
          })
        }
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
      {model: uppercasedValue},
      () => input.setSelectionRange(start, end)
    );
  }
  handleChangeBrand = (option) => {
    this.setState({selectedBrand: option,selectedBrandChanged: true})
  }
  modalClosed = () => {
    let { closeModal } = this.props;
    this.setState({model: ''});
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
    this.setState({model: ''});

    toggle();
  }

	render() {
		let { modal,className,callBack,closeModal,data,brandsSelect } = this.props;
    let { model,selectedBrand } = this.state;

    let brandOptions = brandsSelect.filter((v) => v.value != "all");
		return (
			<Modal isOpen={modal} className={className} toggle={this.toggleCallback} backdrop={true} keyboard={true} centered={true}>
        <ModalHeader>Edit Model</ModalHeader>
        <ModalBody>
        	<Row>
            <Col md="12">
              <label>Brand Name</label> <br />
              <Select
                options={brandOptions}
                placeholder="Select Brand"
                value={selectedBrand ? selectedBrand : data[2]}
                onChange={this.handleChangeBrand}
              />
            </Col>
          	<Col md="12">
          		<label>Model Name</label> <br />
          		<Input autoComplete="off" placeholder={data[1]} onChange={(e) => this.handleChange(e)} value={model} onKeyPress={(e) => this.submitForm(e)} />
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
   return { actions: bindActionCreators(Object.assign({}, AuthActions,CategoryActions, ), dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditModel);

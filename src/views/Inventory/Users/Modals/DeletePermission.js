import React from 'react';
//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as AuthActions from 'actions/auth';
import * as UserActions from 'actions/prev/users';

import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input } from 'reactstrap';
import toastr from 'toastr';

class DeletePermission extends React.PureComponent {

	constructor(props) {
		super(props);

    this.state = {}
	}

  delete = () => {
    const that = this;
    let { brand } = this.state;
    let { callBack,closeModal,data } = this.props;

    that.props.actions.DeletePermission(data[0])
    .then((res) => {
      toastr.remove();
      if(res){
        toastr.success("User permission successfully deleted");
      }else{
        toastr.error("Failed to delete permission");
      }
      callBack();
      closeModal();
    })
    
  }
  modalClosed = () => {
    let { closeModal } = this.props;
    closeModal();
  }
  toggleCallback = () => {
    let { toggle } = this.props;

    toggle();
  }

	render() {
		let { modal,className,callBack,closeModal,onOpened, } = this.props;
		return (
			<Modal isOpen={modal} className={className} toggle={this.toggleCallback} backdrop={true} centered={true} onOpened={onOpened}>
        <ModalHeader>Delete Permission</ModalHeader>
        <ModalBody>
        	<Row>
          	<Col md="12">
          		<label>Are you sure you want to delete this permission?</label> <br />
              <b>{this.props.data[1] || ''}</b>
          	</Col>
        	</Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.modalClosed}>Cancel</Button>{' '}
          <Button id="delete" color="danger" onClick={this.delete}>Delete</Button>
        </ModalFooter>
      </Modal>
		);
	}
}

const mapStateToProps = state => ({
  authenticated: state.user_auth.authenticated,
  loggingIn: state.user_auth.loggingIn,
  loggingOut: state.user_auth.loggingOut,
});

function mapDispatchToProps(dispatch) {
   return { actions: bindActionCreators(Object.assign({}, AuthActions,UserActions,), dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeletePermission);

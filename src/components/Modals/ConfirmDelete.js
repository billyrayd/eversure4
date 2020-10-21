import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default class ConfirmDelete extends React.PureComponent {

	constructor(props) {
		super(props);
	}

	render() {
		let { modal,className,callBack,closeModal } = this.props;
		return (
			<Modal isOpen={modal} className={className} backdrop={true} keyboard={false}>
        <ModalHeader>Delete Confirmation</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this data?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={callBack}>Yes, Delete Data</Button>{' '}
          <Button color="secondary" onClick={closeModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
		);
	}
}

import React from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input } from 'reactstrap';

export default class AddUser extends React.PureComponent {

	constructor(props) {
		super(props);
	}

	render() {
		let { modal,className,callBack,closeModal } = this.props;
		return (
			<Modal isOpen={modal} className={className} backdrop={true} keyboard={false} size="lg">
        <ModalHeader>Add System User</ModalHeader>
        <ModalBody>
        	<Row>
          	<Col md="6">
          		<label>Name</label> <br />
          		<Input placeholder="Enter full name" />
          	</Col>
          	<Col md="6">
          		<label>Username</label> <br />
          		<Input placeholder="Enter username" />
          	</Col>
        	</Row>
        	<Row>
          	<Col md="6">
          		<label>Email</label> <br />
          		<Input placeholder="Enter Email" />
          	</Col>
          	<Col md="6">
          		<label>Position</label> <br />
          		<Input placeholder="Select position" />
          	</Col>
        	</Row>
        	<Row>
          	<Col md="6">
          		<label>Branch</label> <br />
          		<Input placeholder="Select branch" />
          	</Col>
          	<Col md="6">
          		<label>Address</label> <br />
          		<Input placeholder="Enter address" />
          	</Col>
        	</Row>
        	<Row>
          	<Col md="6">
          		<label>Password</label> <br />
          		<Input placeholder="Enter password" />
          	</Col>
          	<Col md="6">
          		<label>Confirm Password</label> <br />
          		<Input placeholder="Confirm password" />
          	</Col>
        	</Row>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" className="es-main-btn" onClick={callBack}>Save</Button>{' '}
          <Button color="secondary" onClick={closeModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
		);
	}
}

import React from 'react';

//reactstrap
import {
	Container,
	Row,
	Col
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class NoAccess extends React.PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
		const noPermission = "You do not have the right permissions to access this page";
		const accessDenied = "Access Denied"
		return (
			<Container>
				<Row>
					<Col md="2">
					<br />
					<br />
					</Col>
					<Col className="align-center">
						<br />
						<br />
						<br />
						<br />
						<FontAwesomeIcon icon="exclamation-circle" className="fontSize100" />
						<h1>{accessDenied}</h1>
					</Col>
					<Col md="2" />
				</Row>
			</Container>
		);
	}
}

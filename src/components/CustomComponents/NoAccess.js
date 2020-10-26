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
						<h1>You do not have the right permissions to access this page</h1>
					</Col>
					<Col md="2" />
				</Row>
			</Container>
		);
	}
}

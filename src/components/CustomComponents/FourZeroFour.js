import React from 'react';

//reactstrap
import {
	Container,
	Row,
	Col
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import EversureLogo from 'assets/logo/eversure_logo.png';

export default class FourZeroFour extends React.PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<Container>
					<div className="fourZeroFour">
						{/* <img src={EversureLogo} alt="logo" /> */}
						<h1 className="text-danger">
							<FontAwesomeIcon icon="exclamation-triangle" className="fontSize100" />
						</h1>
						<h1 className="text-danger">404</h1>
						<h2 className="text-danger">Page Not Found</h2>
					</div>
				</Container>
			</div>
		);
	}
}

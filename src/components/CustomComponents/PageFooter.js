import React from 'react';

import { MY_APP } from 'helpers';

//reactstrap
import {
	Container,
	Row,
	Col,
} from 'reactstrap';

export default class PageFooter extends React.PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<div className="page-footer">
					<small>Eversure v{MY_APP.version}</small>
				</div>
			</div>
		);
	}
}

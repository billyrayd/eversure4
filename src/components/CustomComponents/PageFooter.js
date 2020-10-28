import React from 'react';

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
					<small>Eversure v4.0.0</small>
				</div>
			</div>
		);
	}
}

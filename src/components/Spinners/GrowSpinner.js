import React from 'react';

import { Spinner } from 'reactstrap';

export default class GrowSpinner extends React.PureComponent {

	constructor(props) {
		super(props);
	}

	render() {
		let { visible } = this.props;
		return (
			<div>
				{
					visible ? <div className="spinner-wrap">
											<Spinner className="esBlue" type="grow" color="primary" />{" "}
											<Spinner className="esBlue" type="grow" color="primary" />{" "}
											<Spinner className="esBlue" type="grow" color="primary" />
										</div> : null
				}
			</div>
		);
	}
}

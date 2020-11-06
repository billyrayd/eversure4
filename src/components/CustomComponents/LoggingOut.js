import React from 'react';

//reactstrap
import {
	Container,
	Row,
	Col,
	Spinner
} from 'reactstrap';

export default class LoggingOut extends React.PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				{
					this.props.loggingOut ?
					<div className="logout-wrap">
						<div className="inner">
							<Spinner style={{width: '4rem', height: '4rem'}} className="esBlue" />
							<br />
							<br />
							<b className="esBlue">Logging Out</b>
						</div>
					</div> : null
				}
			</div>
		);
	}
}

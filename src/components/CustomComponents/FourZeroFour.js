import React from 'react';

//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as AuthActions from 'actions/auth';

//reactstrap
import {
	Container,
	Row,
	Col
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

import PageFooter from 'components/CustomComponents/PageFooter';

import EversureLogo from 'assets/logo/eversure_logo.png';

class FourZeroFour extends React.PureComponent {
	constructor(props) {
		super(props);
	}

	goBack = () => {
		let { authenticated } = this.props;

		if(authenticated){
			this.props.history.goBack();
		}else{
			this.props.history.push("/");
		}
	}

	render() {
		return (
			<div>
				<Container>
					<div className="fourZeroFour">
						<img src={EversureLogo} alt="logo" />
						<h1 className="text-danger">
							<FontAwesomeIcon icon="exclamation-triangle" className="fontSize100" />
						</h1>
						<h1 className="text-danger">404</h1>
						<h2 className="text-danger">Page Not Found</h2>
						<br />
						<h6 style={{cursor: 'pointer'}} onClick={this.goBack}><FontAwesomeIcon icon="caret-left" /> GO BACK</h6>
					</div>
				</Container>
				<PageFooter />
			</div>
		);
	}
}

const mapStateToProps = state => ({
  authenticated: state.user_auth.authenticated,
});

function mapDispatchToProps(dispatch) {
   return { actions: bindActionCreators(Object.assign({}, AuthActions), dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(FourZeroFour);

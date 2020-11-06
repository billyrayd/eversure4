import React from 'react';
//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as AuthActions from 'actions/auth';

import { Link } from 'react-router-dom';

//reactstrap
import {
	Container,
	Row,
	Col,
	FormGroup,
	Input,
	Button,
} from 'reactstrap';

import PageFooter from 'components/CustomComponents/PageFooter';

import EversureLogo from 'assets/logo/eversure_logo.png';

class ResetPassword extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {

		}
	}

	resetPassword = () => {
		console.log('Hello')
	}

	cancelRequest = () => {
		this.props.history.push("/")
	}

	render() {
		return (
			<div>
				<Container>
					<Row>
						<div className="login-main">
							<div className="login-inner">
								<FormGroup className="logo-wrap">
									<img src={EversureLogo} alt="logo" className="logo" />
								</FormGroup>
								<FormGroup className="title-wrap">
									<h3>Forgot Password?</h3>
									<h6>Enter your email below and we'll send you a new password</h6>
								</FormGroup>
								<div className="space" />
								<FormGroup>
									<Input placeholder="Enter Email" autoFocus />
								</FormGroup>
								<FormGroup>
									<Button color="primary" className="es-main-btn" block onClick={this.resetPassword}>
										Reset
									</Button>
								</FormGroup>
								<FormGroup>
									<Button block onClick={this.cancelRequest}>
										Cancel
									</Button>
								</FormGroup>
							</div>
						</div>
					</Row>
				</Container>
				<PageFooter />
			</div>
		);
	}
}

const mapStateToProps = state => ({
  authenticated: state.user_auth.authenticated,
  loggingIn: state.user_auth.loggingIn,
});

function mapDispatchToProps(dispatch) {
   return { actions: bindActionCreators(Object.assign({}, AuthActions), dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
import React from 'react';
//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as AuthActions from 'actions/auth';

import { Link } from 'react-router-dom';
import toastr from 'toastr';

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

class Login extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: ''
		}
	}
	componentDidMount(){
	}
	componentWillUnmount(){
		toastr.remove();
	}
	submitInput = (e) => {
		const that = this;
    if (e.key === 'Enter') {
        that.login();
    }
	}
	login = () => {
		const that = this;
		let { username,password } = this.state;

		this.props.actions.Authenticate(username,password)
		.then((res) => {
			if(res){
				toastr.success("Access Granted!");
				setTimeout(() => {
					that.props.actions.LoginUser(true);
				}, 1000 * 2)
			}else{
				toastr.error("Invalid username or password");
			}
		})
	}

	render() {
		let { username,password } = this.state;
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
									<h3>Welcome!</h3>
									<h6>Login to your account</h6>
								</FormGroup>
								<div className="space" />
								<FormGroup>
									<Input placeholder="Enter Username" onChange={ (e) => this.setState({username: e.target.value}) } value={username} onKeyPress={(e) => this.submitInput(e)} />
								</FormGroup>
								<FormGroup>
									<Input type="password" placeholder="Enter Password" onChange={ (e) => this.setState({password: e.target.value}) } value={password} onKeyPress={(e) => this.submitInput(e)} />
								</FormGroup>
								<FormGroup>
									<Button color="primary" className="es-main-btn" block onClick={this.login}>
										Login
									</Button>
								</FormGroup>
								<FormGroup>
									<Link to="/reset_password/">Forgot Password?</Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
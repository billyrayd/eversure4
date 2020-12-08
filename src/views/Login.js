import React from 'react';
//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as AuthActions from 'actions/auth';
import * as LoginActions from 'actions/prev/login';

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
	Spinner,
} from 'reactstrap';

import PageFooter from 'components/CustomComponents/PageFooter';

import EversureLogo from 'assets/logo/eversure_logo.png';


class Login extends React.PureComponent {
	_isMounted = false;
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: '',
			active: true,
		}
	}
	componentDidMount(){
		const that = this;
		that.props.actions.LoggingIn(false);
		that._isMounted = true;
	}
	componentWillUnmount(){
		const that = this;
		toastr.remove();
		that._isMounted = false;
	}
	submitInput = (e) => {
		const that = this;
    if (e.key === 'Enter') {
    		e.target.blur(); // hide virtual keyboard on mobile devices
        that.login();
    }
	}
	login = () => {
		const that = this;
		let { username,password,active } = this.state;
		
		toastr.remove();

		if(username.trim() == ""){
			that.setState({username:''})
			toastr.info("Please enter username");
		}
		else if(password.trim() == ""){
			that.setState({password:''})
			toastr.info("Please enter password");
		}else{
			that.props.actions.Authenticate(username,password)
			.then((res) => {
				if(that._isMounted){
					if(res.status){
						toastr.success(res.message);
						setTimeout(() => {
							let now = new Date();
	    				that.props.actions.SetActiveTime(now);
							that.props.actions.LoginUser(true);
						}, 1000 * 1.5)
					}else{
						toastr.error(res.message);
						that.setState({password: ''});
					}
				}
			})
		}
	}

	render() {
		let { username,password } = this.state;
		let { loggingIn } = this.props;
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
									<Input placeholder="Enter Username" onChange={ (e) => this.setState({username: e.target.value}) } value={username} onKeyPress={(e) => this.submitInput(e)} autoFocus />
								</FormGroup>
								<FormGroup>
									<Input type="password" placeholder="Enter Password" onChange={ (e) => this.setState({password: e.target.value}) } value={password} onKeyPress={(e) => this.submitInput(e)} />
								</FormGroup>
								<FormGroup>
									<Button color="primary" className="es-main-btn" block onClick={this.login} disabled={loggingIn || username.trim() == '' && password.trim() == '' }>
										{
											loggingIn ? <Spinner color="light" size="sm" /> : "Login"
										}
									</Button>
								</FormGroup>
								<FormGroup>
									<Link className="esBlue" to="/reset_password/">Forgot Password?</Link>
									<div id="sideBar" />
									<div id="appVersion" />
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
   return { actions: bindActionCreators(Object.assign({}, AuthActions, LoginActions), dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
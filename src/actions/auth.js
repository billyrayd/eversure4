
import {
	AUTHENTICATED,
	SET_USER_INFO,
	LOGGING_IN,
	LOGGING_OUT,
} from '../constants';

import feathers from 'helpers/feathers';

export const Authenticate = (username, password) => {
	return (dispatch, getState) => {
		let output = {};

		dispatch(LoggingIn(true));

		return feathers.authenticate({
			strategy: 'local',
			username: username,
			password: password,
		})
		.then(() => {
			output.status = true;
			output.message = "Access Granted!";
			return Promise.resolve(output);
		})
		.catch((e) => {
			output.status = false;
			output.message = "Invalid username or password";
			if(e.code == 408){
				output.message = "Could not connect to the server";
			}

			return new Promise(function(resolve){
				setTimeout(() => {

					dispatch(LoggingIn(false));
					return resolve(output);
				}, 1000 * 1.5)
			})
			// return Promise.resolve(output);
		})
	}
}

export const LoggingIn = (status) => {
	return {
		type: LOGGING_IN,
		status: status
	}
}

export const LoggingOut = (status) => {
	return {
		type: LOGGING_OUT,
		status: status
	}
}

export function LoginUser(status){
	return (dispatch, getState) => {
		dispatch({
			type: AUTHENTICATED,
			status: status
		})
	}
}

export const Logout = () => {
	return (dispatch, getState) => {
		return feathers.logout()
		.then(() => {
			return new Promise(function(resolve){
				setTimeout(() => {
					
					dispatch(LoggingIn(false));
					return resolve(true);
				}, 1000 * 1.5)
			})
		})
		.catch(() => {
			return Promise.resolve(false);
		})
	}
}
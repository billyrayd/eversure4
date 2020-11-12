
import {
	AUTHENTICATED,
	SET_USER_INFO,
	LOGGING_IN,
	LOGGING_OUT,
	ACTIVE_TIME,
} from '../constants';

import feathers from 'helpers/feathers';

import { GetUserData, GetUserPermissions } from 'actions/prev/login';

export const Authenticate = (username, password) => {
	return (dispatch, getState) => {
		let output = {};

		dispatch(LoggingIn(true));

		return feathers.authenticate({
			strategy: 'local',
			username: username,
			password: password,
		})
		.then((data) => {
			let { user } = data;

			output.status = true;
			output.message = "Access Granted!";

			dispatch(GetUserData(user._id));
			dispatch(GetUserPermissions(user.type));

			return Promise.resolve(output);

			// return GetUserData(data.user._id)
			// .then((res) => {
			// 	console.log('res')
			// 	console.log(res)
			// 	console.log(res)
			// 	if(res){
			// 		return Promise.resolve(output);
			// 	}else{
			// 		output.status = false;
			// 		output.message = "An error occured. Please try again.";

			// 		return Promise.resolve(output);
			// 	}
			// })
		})
		.catch((e) => {
			console.log(e)
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

export const SetActiveTime = (datetime) => {
	return {
		type: ACTIVE_TIME,
		data: datetime
	}
}
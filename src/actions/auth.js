
import {
	AUTHENTICATED,
	SET_USER_INFO,
	LOGGING_IN,
} from '../constants';

import feathers from 'helpers/feathers';

export const Authenticate = (username, password) => {
	return (dispatch, getState) => {

		// dispatch({
		// 	type: AUTHENTICATED,
		// 	status: status
		// })

		return feathers.authenticate({
			strategy: 'local',
			username: username,
			password: password,
		})
		.then(() => {
			return Promise.resolve(true)
		})
		.catch(() => {
			return Promise.resolve(false)
		})
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
			return Promise.resolve(true)
		})
		.catch(() => {
			return Promise.resolve(false)
		})
	}
}
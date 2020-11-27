
import {
	AUTHENTICATED,
	SET_USER_INFO,
	LOGGING_IN,
	LOGGING_OUT,
	ACTIVE_TIME,
} from '../constants';

import feathers from 'helpers/feathers';

import { GetUserData,GetUserPermissions,SetUserPermissions,SetUserData, } from 'actions/prev/login';

var async = require("async");

export const Authenticate = (username, password) => {
	return (dispatch, getState) => {
		let output = {};

		// username = "stratium";
		// password = "strat101";

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
			dispatch(GetUserPermissions(user._id,user.type));

			return Promise.resolve(output);
		})
		.catch((e) => {
			output.status = false;
			output.message = "Incorrect username or password";
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
					dispatch(SetUserPermissions([]));
					dispatch(SetUserData([]));
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
export const DeleteAllData = () => {
	return (dispatch,getState) => {
		return new Promise(function(resolve){
			async.parallel({
				userPermissionsList: (callback) => {
					let Service = feathers.service("permission");
					let DataWithStatus = [];

					Service.find()
					.then((result) => {
						if(result.data.length > 0){
							let col = result.data;

							var recursive = (value) => {
								if(value > 0){
									Service.remove(col[value]._id)
									.then(() => {
										DataWithStatus.push({data: col[value], deleted: true});
										return recursive(value - 1);
									})
									.catch(() => {
										DataWithStatus.push({data: col[value], deleted: false});
										return recursive(value - 1);
									})
								}else{
									Service.remove(col[value]._id)
									.then(() => {
										DataWithStatus.push({data: col[value], deleted: true});
										callback(null, DataWithStatus);
									})
									.catch(() => {
										DataWithStatus.push({data: col[value], deleted: true});
										callback(null, DataWithStatus);
									})
									
								}
							}

							recursive(col.length - 1)
						}else{
							DataWithStatus.push({data: 'no data found'});
							callback(null, DataWithStatus);
						}
					})
				}
			}, (error,collection) => {
				console.log('collection')
				console.log(collection)
			})
		})
	}
}
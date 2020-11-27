import {
	LOGIN,
	USER_DATA,
	USER_PERMISSION,
	HOST_IP,
} from 'constants/prev/action_types';

import feathers from 'helpers/feathers';
import { _groupByProp,_sortByProp, } from 'helpers/';

import toastr from 'toastr';

export function loginUser(data){
	return (dispatch, getState) => {
		toastr.remove()
		dispatch({
			type: LOGIN,
			status: data
		})
	}
}

export function getUserId(username){
	return (dispatch, getState) => {
		var usersService = feathers.service('users');

		let trapper = {
			query: {
				// email: username,
				username: username,
			}
		}

		return usersService.find(trapper)
		.then((data) =>{
			return Promise.resolve(data)
		})
		.catch((error) => {
			return Promise.resolve(error)
		})
	}
}

export function GetUserData(id){
	return (dispatch, getState) => {
		var usersService = feathers.service('users');

		let trapper = {
			query: {
				_id: id,
				$limit: 1
			}
		}

		return usersService.find(trapper)
		.then((data) =>{
  			var access_level = data.data[0].access_level,
	  			branch = data.data[0].branch,
	  			email = data.data[0].email,
	  			fullname = data.data[0].fullname,
	  			position = data.data[0].type,
	  			status = data.data[0].status,
	  			username = data.data[0].username;

  			var fetchedUserData = {
  				access_level,
					branch,
					email,
					fullname,
					position,
					status,
					username,
  			}

  			dispatch(SetUserData(data.data[0]))

			return Promise.resolve(data.data)
			// return Promise.resolve(fetchedUserData)
		})
		.catch((error) => {
			return Promise.resolve(false)
		})
	}
}

export function SetUserData(data){
	return {
		type: USER_DATA,
		data: data
	}
}

export function GetUserPermissions(userid,usertype){
	return (dispatch, getState) => {
		var permissionService = feathers.service('permission');
		var permissionListService = feathers.service("permission-list");
		let query = {};
		var defaultPermissions = {
        dashboard: 0,
        inventory: 0,
        user: 0,
        customer: 0,
        report: 0,
        category: 0,
        accounting: 0
    };

		let trapper = {
			query: {
				user_id: userid // user-position _id
			}
		}

		// query.order = {
		// 	$in: [123,1234]
		// }

		permissionListService.find({
			query: query
		})
		.then((res) => {

			let def = [];

			if(res.data.length > 0){
				let pList = res.data;

				// pList.map((v,i) => {
				// 	def.push({permission: v.permission_name , level: 0})
				// })

				pList.map((v,i) => {
            def.push({
                _id: v._id,
                system_type: v.system_type,
                group: v.group,
                permission_name: v.permission_name,
                page: v.page,
                order: v.order
            })
        })

        let groupedData = _groupByProp(def);
        let sortedPermissions = [];

        groupedData.map((v) => {
          sortedPermissions.push({
            system_type: v.system_type,
            permissions: _sortByProp(v.permissions, ['order'], ['ASC'])
          })
        })

				permissionService.find({
					query: {
						user_id: userid,
						user_type_id: usertype,
					}
				})
				.then((find_permission) => {
					if(find_permission.data.length > 0){
						let col = find_permission.data;
						let permissionsList = col[0].permissions;

						dispatch(SetUserPermissions(permissionsList))
					}else{
						permissionService.create({
							user_id: userid,
							user_type_id: usertype,
							permissions: sortedPermissions,
						})
						.then((c) => {
							let permissionsList = c.permissions;

							dispatch(SetUserPermissions(permissionsList));
						})
					}
				})
			}
		})


		return true;

		// return permissionService.find(trapper)
		// .then((data) => {
		// 	if(data.total){
		// 		var permissions = data.data[0].permissions
		// 		dispatch(SetUserPermissions(permissions))

		// 		return Promise.resolve(true);
		// 	}else{
		// 		dispatch(SetUserPermissions(defaultPermissions))

		// 		return Promise.resolve(true);
		// 	}
		// })
		// .catch((error) => {
		// 	console.log('error')
		// 	console.log(error)

		// 	return Promise.resolve(false);
		// })

	}
}

export function SetUserPermissions(data){
	return {
		type: USER_PERMISSION,
		data: data
	}
}

export const setHostIp = (ip) => {
	return {
		type: HOST_IP,
		data: ip
	}
}

export const requestForReset = (email) => {
	return (dispatch, getState) => {
		let output = {};
		return feathers.service("password-request")
		.create({
			email: email,
			request_date: new Date(),
			processed_by: '',
			date_processed: '',
		})
		.then((success) => {
			output.status = true;
			output.message = "Request for password reset has been successfully sent.";
			return Promise.resolve(output)
		})
		.catch((error) => {
			output.status = false;
			output.message = "Error sending request for password reset";
			return Promise.resolve(output)
		})
	}
}
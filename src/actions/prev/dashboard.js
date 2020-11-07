import {
	SAMPLE_SALES,
	GRAPH_TYPE,
	GRAPH_PARAM,
	SET_NOTIFICATIONS,
	SET_UNREAD_NOTIFS,
}
from '../constants/dashboard'

import feathers from '../helpers/feathers'

import toastr from 'toastr'

export function salesPerBranch() {
	return (dispatch, getState) => {
		var branchService = feathers.service('branches')

		return branchService.find()
		.then((branches) => {
			return Promise.resolve(branches)
		})
		.catch((err) => {
			console.log('err ', err)
		})
	}
}

export function topSellingModels(){
	return (dispatch, getState) => {
		var productService = feathers.service('products')

		return productService.find({
            query: {
                type: 1,
                $limit: 5,
                $sort: {
                    price: -1
                }
            }
        })
        .then((products) => {
        	return Promise.resolve(products)
        })
		.catch((err) => {
			console.log('err ', err)
		})
	}
}

export function getSales(data){
	return {
		type: SAMPLE_SALES,
		data: data
	}
}

export function setGraphType(data){
	return {
		type: GRAPH_TYPE,
		data: data
	}
}

export function graphParam(data){
	return {
		type: GRAPH_PARAM,
		data: data
	}
}

export function salesPerBranchInfo(type, param){
	return (dispatch, getState) => {
		var productService = feathers.service('products'),
			branchService = feathers.service('branches'),
			graphData = []

		return branchService.find({
			query: {
				branch_name: param
			}
		})
		.then((branch) => {
			var branch = branch.data,
				branchSales = branch

			return Promise.resolve(branchSales)

		})
		.catch((err) => {
			console.log('err ', err)
			return Promise.resolve(false)
		})
	}
}

export function topSellingModelsInfo(type, param){
	return (dispatch, getState) => {
		var productService = feathers.service('products'),
			branchService = feathers.service('branches'),
			graphData = []

		return productService.find({
			query: {
				motorModels: {
					model_name: param
				}
			}
		})
		.then((product) => {
			var product = product.data,
				productSales = product

			return Promise.resolve(productSales)

		})
		.catch((err) => {
			return Promise.resolve(false)
			console.log('err ', err)
		})
	}

}

export const getNotifications = () => {
	return (dispatch, getState) => {
		return feathers.service("password-request")
		.find({
			query: {
				status: 1,
				$sort: {
					unread: -1
				}
			}
		})
		.then((result) => {
			if(result.data.length > 0){
				var res = result.data;
				var collection = [];
				var unread = 0

				res.map((v, i) => {
					const actionBtn = `<button class="btn btn-sm btn-new-view action" title="Check">Check</button>`;

					if(v.unread == 1){
						unread += 1
					}

					collection.push([v, v.email, (new Date(v.request_date)).toLocaleDateString()+' - '+(new Date(v.request_date)).toLocaleTimeString(), actionBtn])
				})

				dispatch(setUnreadNotifs(unread))
				dispatch(setNotifications(collection))

				return Promise.resolve(collection)
			}else{
				dispatch(setNotifications([]))

				return Promise.resolve(false)
			}
		})
		.catch((error) => {
			console.log("error ", error)
			dispatch(setNotifications([]))

			return Promise.resolve(false)
		})
	}
}

export const setNotifications = (data) => {
	return {
		type: SET_NOTIFICATIONS,
		data: data
	}
}

export const setUnreadNotifs = (data) => {
	return {
		type: SET_UNREAD_NOTIFS,
		data: data
	}
}

export const deleteOne = (service,id) => {
	return (dispatch, getState) => {

		return feathers.service(service)
		.remove(id)
		.then((s) => {
			console.log(s)
			return Promise.resolve(true)
		})
		.catch((e) => {
			console.log(e)
			return Promise.resolve(false)
		})
	}
}

export const sendMail = (email,id) => {
	return (dispatch, getState) => {
		let output = {};

		return feathers.service('send-mail')
		.create({email: email})
		.then((s) => {
			if(s.email == "failed"){
				output.status = false;
				return Promise.resolve(output)
			}else{

				feathers.service("users").patch(id, {password: s.new_pass})
				.then((result) => {
					console.log('result')
					console.log(s.new_pass)
					console.log(result)
				})
				.catch((error) => {
					console.log('error')
					console.log(error)
				})

				output.status = true;
				return Promise.resolve(output)
			}
		})
		.catch((e) => {
			console.log("e ",e)
			output.status = false;
			return Promise.resolve(output)
		})
	}
}

export const getDetails = (email) => {
	return (dispatch, getState) => {
		let output = {};

		return feathers.service("users")
		.find({
			query: {
				email: email
			}
		})
		.then((result) => {
			if(result.data.length > 0){
				output.status = true;
				output.data = result.data;
			}else{
				output.status = false;
			}

			return Promise.resolve(output)
		})
		.catch((error) => {
			output.status = false;
			output.data = error;

			return Promise.resolve(output)
		})
	}
}

export const readRequest = (id) => {
	return (dispatch, getState) => {
		feathers.service("password-request")
		.patch(id, {unread: 0})
		.then((update) => {
			console.log('update')
		})
		.catch((error) => {
			console.log('error')
		})
	}
}

import {
	AUTHENTICATED,
	SET_USER_INFO,
	LOGGING_IN,
} from '../constants'

export const Authenticate = (status) => {
	return (dispatch, getState) => {

		dispatch({
			type: AUTHENTICATED,
			status: status
		})

		return Promise.resolve(true)
	}
}
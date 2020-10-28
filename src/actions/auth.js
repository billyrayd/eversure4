
import {
	AUTHENTICATED,
	SET_USER_INFO,
	LOGGING_IN,
} from '../constants'

export const Authenticate = (status) => {
	return (dispatch, getState) => {
		console.log("authenticate")

		dispatch({
			type: AUTHENTICATED,
			status: status
		})
	}
}
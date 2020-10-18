import {
	TEST
} from '../constants'


export const test = () => {
	return (dispatch, getState) => {
		console.log("test")

		dispatch({
			type: TEST,
			data: "test data"
		})
	}
}
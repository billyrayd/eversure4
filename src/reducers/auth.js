import
{
	LOGGING_IN,
	AUTHENTICATED,
	SET_USER_INFO,
} from '../constants/';

const initialState = {
	authenticated: false,
	loggingIn: false,
	userInfo: [],
}

export default function user_auth(state = initialState, action){
	switch(action.type){
		case LOGGING_IN:
			return {...state, loggingIn: action.status}; break;
		case AUTHENTICATED:
			return {...state, authenticated: action.status}; break;
		case SET_USER_INFO:
			return {...state, userInfo: action.data}; break;
		default:
			return state;
	}
}
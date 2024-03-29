import
{
	LOGGING_IN,
	AUTHENTICATED,
	SET_USER_INFO,
	LOGGING_OUT,
	ACTIVE_TIME,
} from '../constants/';

const initialState = {
	authenticated: false,
	loggingIn: false,
	loggingOut: false,
	userInfo: [],
	activeTime: false,
}

export default function user_auth(state = initialState, action){
	switch(action.type){
		case LOGGING_IN:
			return {...state, loggingIn: action.status}; break;
		case LOGGING_OUT:
			return {...state, loggingOut: action.status}; break;
		case AUTHENTICATED:
			return {...state, authenticated: action.status}; break;
		case SET_USER_INFO:
			return {...state, userInfo: action.data}; break;
		case ACTIVE_TIME:
			return {...state, activeTime: action.data}; break;
		default:
			return state;
	}
}
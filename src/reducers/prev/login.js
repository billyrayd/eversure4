import { 
  LOGIN,
  USER_DATA,
  USER_PERMISSION,
  HOST_IP,
} from 'constants/prev/action_types';

const initialState = {
    loginStatus : false,
    userData: [],
    userPermission: [],
    host_ip: false
}

export default function login(state = initialState, action) {
    switch (action.type) {
        case LOGIN:
            return {
            ...state,
            loginStatus: action.status
        }
        break;

        case USER_DATA:
            return {
                ...state,
                userData: action.data
            }
        break;

        case USER_PERMISSION:
            return {
                ...state,
                userPermission: action.data
            }
        break;
        case HOST_IP: return {...state, host_ip: action.data}

        default: return state;
  }
}
import { 
  LOGIN,
  USER_DATA,
  USER_PERMISSION,
} from 'constants/prev/action_types';

const initialState = {
    loginStatus : false,
    userData: [],
    userPermission: [],
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

        default: return state;
  }
}
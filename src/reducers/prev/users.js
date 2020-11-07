import {
USERS_LIST,
SET_USER_INFO,
SET_PERMISSION_USER,
DESIGNATION_LIST,
SELECTED_USER_PERMISSION,
ACTIVE_USER_IN_PERMISSION,
EDIT_USER_INFO,
} from 'constants/prev/users'

const initialState = {
	users: [],
	usersDataTables: [],
	userInfo: [],
    designationList: [],
    selectedPermissions: null,
    activeUserInPermission: null,
    userInfoEdit: ''
}


export default function users(state = initialState, action) {
    switch (action.type) {

    	case USERS_LIST:
    	return {
    		...state,
    		users: action.data ? action.data[0] : '',
    		usersDataTables: action.data ? action.data[1] : ''
    	}
    	break;

    	case SET_USER_INFO:
    	return {
    		...state,
    		userInfo: action.data
    	}
    	break;

        case DESIGNATION_LIST:
            return {
                ...state,
                designationList: action.data
            }
        break;

        case SELECTED_USER_PERMISSION:
            return {
                ...state,
                selectedPermissions: action.data
            }
        break;

        case ACTIVE_USER_IN_PERMISSION:
            return {
                ...state,
                activeUserInPermission: action.data
            }
        break;

        case EDIT_USER_INFO:
            return {
                ...state,
                userInfoEdit: action.data
            }
        break;

    	default: return state;
    }
}

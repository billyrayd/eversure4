import{
	SAMPLE_SALES,
	GRAPH_TYPE,
	GRAPH_PARAM,
	SET_NOTIFICATIONS,
	SET_UNREAD_NOTIFS,
}
from '../constants/dashboard';

const initialState = {
	sales: [],
	graphType: '',
	graphParam: '',
	notifications: [],
	unread: 0
}

export default function category(state = initialState, action) {
	switch (action.type){

		case SAMPLE_SALES:
			return {
				...state,
				sales: action.data
			}
		break

		case GRAPH_TYPE:
			return {
				...state,
				graphType: action.data
			}
		break;

		case GRAPH_PARAM:
			return {
				...state,
				graphParam: action.data
			}
		break;
		case SET_NOTIFICATIONS: return { ...state, notifications: action.data }; break;
		case SET_UNREAD_NOTIFS: return { ...state, unread: action.data }; break;

		default: return state;
	}
}
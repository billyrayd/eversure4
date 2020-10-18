import
{
	CHART,
	TEST,
} from '../constants/';

const initialState = {
	chart: [],
	test: ""
}

export default function dashboard(state = initialState, action){
	switch(action.type){
		case CHART:
			return {...state, chart: action.data}; break;
		case TEST:
			return {...state, test: action.data}; break;
		default:
			return state;
	}
}
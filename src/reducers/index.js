import { combineReducers } from 'redux';

import user_auth from './auth';
import dashboard from './dashboard';

const rootReducer = combineReducers({
	user_auth,
	dashboard,
})

export default rootReducer;
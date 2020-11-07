import { combineReducers } from 'redux';

import user_auth from './auth';
import dashboard from './dashboard';

import login from 'reducers/prev/login';
import customers from 'reducers/prev/customers';
import products from 'reducers/prev/product';
import category from 'reducers/prev/category';
import users from 'reducers/prev/users';

const rootReducer = combineReducers({
	user_auth,
	dashboard,
})

export default rootReducer;
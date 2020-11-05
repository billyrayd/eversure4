import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/template.scss";
import "assets/plugins/datatables/css/datatables.css";

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
  faCheckSquare,
  faCoffee,
  faPlus,
  faCaretLeft,
  faSignOutAlt,
  faHome,
  faIndustry,
  faChartLine,
  faUsers,
  faCogs,
  faList,
  faMoneyBill,
  faEdit,
  faTrash,
  faEye,
  faBell,
  faTachometerAlt,
  faFileAlt,
  faUserFriends,
  faBook,
  faMoneyCheckAlt,
  faStopwatch,
  faFileContract,
  faExclamationCircle,
  faExclamationTriangle,
  faBars,
  faEllipsisV,
  faTimes,
  faCheck,
  faBan,
} from '@fortawesome/free-solid-svg-icons';

import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { PersistGate } from 'redux-persist/integration/react';

import storeWithPersist from './store';

const { store, persistor } = storeWithPersist();
const history = createBrowserHistory();

library.add(
  fab,
  faCheckSquare,
  faCoffee,
  faPlus,
  faCaretLeft,
  faSignOutAlt,
  faHome,
  faIndustry,
  faChartLine,
  faUsers,
  faCogs,
  faList,
  faMoneyBill,
  faEdit,
  faTrash,
  faEye,
  faBell,
  faTachometerAlt,
  faFileAlt,
  faUserFriends,
  faBook,
  faMoneyCheckAlt,
  faStopwatch,
  faFileContract,
  faExclamationCircle,
  faExclamationTriangle,
  faBars,
  faEllipsisV,
  faTimes,
  faCheck,
  faBan,
)

ReactDOM.render(
  <React.Fragment>
  	<Provider store={store} history={history}>
  		<PersistGate persistor={persistor}>
  			<BrowserRouter>
          <App />
    		</BrowserRouter>
    	</PersistGate>
    </Provider>
  </React.Fragment>,
  document.getElementById('root')
);

// <Provider store={store} history={history}><PersistGate persistor={persistor}><BrowserRouter><App /></BrowserRouter></PersistGate></Provider>

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

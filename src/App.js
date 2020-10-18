import React from 'react';

import { Route, Switch, withRouter, HashRouter as Router } from "react-router-dom";

//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as AuthActions from 'actions/auth';

import Routes from './routes';
let {authenticated, unauthenticated} = Routes()

class App extends React.PureComponent{
  render(){
    const AuthenticatedPages = authenticated.map((prop, key) => { return <Route exact path={prop.path} component={prop.component} key={key} /> });
    const UnAuthenticatedPages = unauthenticated.map((prop, key) => { return <Route exact path={prop.path} component={prop.component} key={key} /> });

    return(
      <div className="">
        <Switch>
          {!this.props.authenticated ? AuthenticatedPages : UnAuthenticatedPages}
        </Switch>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  authenticated: state.user_auth.authenticated,
  loggingIn: state.user_auth.loggingIn,
});

function mapDispatchToProps(dispatch) {
   return { actions: bindActionCreators(Object.assign({}, AuthActions), dispatch) }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps, null, {pure:false})(App));

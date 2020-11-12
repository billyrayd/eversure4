import React from 'react';

import { Route, Switch, withRouter, HashRouter as Router } from "react-router-dom";

//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as AuthActions from 'actions/auth';

import toastr from 'toastr';

import FourZeroFour from 'components/CustomComponents/FourZeroFour';

import feathers from 'helpers/feathers';
import { detectMob } from 'helpers/';

import Routes from './routes';

let {authenticated, unauthenticated} = Routes();

var $ = require( 'jquery' );

toastr.options.showMethod = 'slideDown';
// toastr.options.preventDuplicates = true;
// toastr.options.timeOut = 0;
toastr.options.positionClass = 'toast-bottom-right';
if(detectMob){
// toastr.options.positionClass = 'toast-top-right';
}

class App extends React.PureComponent{
  componentWillMount(){
    const that = this;

    feathers.reAuthenticate()
    .then(() => {

    })
    .catch(() => {

    })

    $("body").removeClass("disable-scroll");
    that.props.actions.LoggingIn(false);
    that.props.actions.LoggingOut(false);
  }
  render(){
    const AuthenticatedPages = authenticated.map((prop, key) => { return <Route exact path={prop.path} component={prop.component} key={key} /> });
    const UnAuthenticatedPages = unauthenticated.map((prop, key) => { return <Route exact path={prop.path} component={prop.component} key={key} /> });

    return(
      <div className="">
        <Switch>
          {this.props.authenticated ? AuthenticatedPages : UnAuthenticatedPages}
          <Route component={FourZeroFour} />
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

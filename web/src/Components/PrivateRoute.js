import React from 'react';  
import { Redirect, Route } from 'react-router-dom';
import { AuthConsumer } from '../AuthContext';

const PrivateRouter = ({ component: Component, ...rest }) => (
  <AuthConsumer>
    {({ isAuth }) => (
      <Route {...rest} 
        render={props => (
          isAuth === true ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: 'login',
                state: { from: props.location }
              }}
            />
          )
        )} 
      />
    )}
  </AuthConsumer>
);

export default PrivateRouter;

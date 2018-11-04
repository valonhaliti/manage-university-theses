import React, { Component } from 'react'; 
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from '../AuthContext';
import axios from 'axios';
import LogIn from './Auth/LogIn';
import Theses from './Theses';
import Thesis from './Thesis';
import Layout from './Layout';
import Form from './Forms/uploadThesis';
import Register from './Auth/Register';


class App extends Component {  

  render() {
    return <BrowserRouter>
      <AuthProvider>
      <Layout>
        <Switch>
          <Route exact path="/"  render={() => <div>Home</div>}/>
          <Route exact path="/thesis" component={Theses}/>
          <Route exact path="/thesisByStatus/:status" render={props => <Theses {...props}/>}/>
          <Route exact path="/thesis/:thesisId" render={props => <Thesis {...props}/>}/>
          <PrivateRoute exact path ="/create" component={Form} />
          <Route exact path ="/login" component={LogIn} />
          <Route exact path ="/register" component={Register} />
        </Switch>
      </Layout>
    </AuthProvider>
    </BrowserRouter>
  }
}

export default App;

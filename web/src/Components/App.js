import React, { Component } from 'react'; 
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from '../AuthContext';
import LogIn from './Auth/LogIn';
import Theses from './Theses';
import Thesis from './Thesis';
import Layout from './Layout';
import Form from './Forms/uploadThesis';
import UpdateThesis from './Forms/updateThesis';
import Register from './Auth/Register';
import ThesesSearchPage from './Theses/ThesesSearchPage';


class App extends Component {  

  render() {
    return <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Switch>
              <Route exact path="/"  render={() => <Redirect to="thesis" />}/>
              <Route exact path="/thesis" component={Theses}/>
              <Route exact path="/thesisByStatus/:status" render={props => <Theses {...props}/>}/>
              <Route exact path="/thesis/:thesisId" render={props => <Thesis {...props}/>}/>
              <Route exact path="/thesis/update/:thesisId" render={props => <UpdateThesis {...props}/>}/>
              <PrivateRoute exact path ="/create" component={Form} />
              <Route exact path ="/login" component={LogIn} />
              <Route exact path ="/search/:searchQuery" component={ThesesSearchPage} />
              <Route exact path ="/register" component={Register} />
            </Switch>
          </Layout>
      </AuthProvider>
    </BrowserRouter>
  }
}

export default App;

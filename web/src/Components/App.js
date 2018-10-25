import React, { Component } from 'react'; 
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Theses from './Theses';
import Layout from './Layout';


class App extends Component {  
  render() {
    return (
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route exact path="/"  render={() => <div>Home</div>}/>
            <Route exact path="/theses"  component={Theses}/>
          </Switch>
        </Layout>
      </BrowserRouter>
    );
  }
}


export default App;

import React, { Component } from 'react'; 
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Theses from './Theses';
import Thesis from './Thesis';
import Layout from './Layout';
import Form from './Forms/uploadThesis';

class App extends Component {  
  render() {
    return <BrowserRouter>
      <Layout>
        <Switch>
          <Route exact path="/"  render={() => <div>Home</div>}/>
          <Route exact path="/thesis" component={Theses}/>
          <Route exact path="/thesisByStatus/:status" render={props => <Theses {...props}/>}/>
          <Route exact path="/thesis/:thesisId" render={props => <Thesis {...props}/>}/>
          <Route exact path ="/create"  component={Form} />
        </Switch>
      </Layout>
    </BrowserRouter>
  }
}

export default App;

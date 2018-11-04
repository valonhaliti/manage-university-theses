import React, { Component } from 'react';
import axios from 'axios';
const AuthContext = React.createContext();

class AuthProvider extends Component {
  state = { isAuth: false }

  async componentDidMount() {
    const token = localStorage.getItem('token');
    if (token) {  
      try {
        const response = await axios.post('/api/user/login', "", { headers: { Authorization: `Bearer ${token}` }});
        if (response.status === 200) {  
          this.setState({
            isAuth: true
          });
        }
      } catch (err) {
        console.log('errr1', err);
      } 
    }
  }

  login = () => {
    this.setState({
      isAuth: true
    });
  }

  render() {
    return (
      <AuthContext.Provider
        value={{ 
          isAuth: this.state.isAuth,
          login: this.login
        }} 
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

const AuthConsumer = AuthContext.Consumer;

export { AuthProvider, AuthConsumer };

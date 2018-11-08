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
          localStorage.setItem('userId', response.data.decoded.userId)
        }
      } catch (err) {
        this.setState({
          isAuth: false
        });
      } 
    }
  }

  login = () => {
    this.setState({
      isAuth: true
    });
  }

  logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  
    this.setState({
      isAuth: false
    });
    window.location.reload();
  }

  render() {
    return (
      <AuthContext.Provider
        value={{ 
          isAuth: this.state.isAuth,
          login: this.login,
          logOut: this.logOut
        }} 
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

const AuthConsumer = AuthContext.Consumer;

export { AuthProvider, AuthConsumer };

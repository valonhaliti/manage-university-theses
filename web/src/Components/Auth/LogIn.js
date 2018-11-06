import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { Redirect } from 'react-router-dom';
import { AuthConsumer } from '../../AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const styles = theme => ({
  layout: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class LogIn extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: ''
    }
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  }

  componentWillUnMount() {
    this.isCancelled = true;
  }

  onSubmit = async (e, login) => {
    e.preventDefault();
    const { email, password } = this.state;
    try {
      const response = await axios.post('/api/user/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', jwtDecode(response.data.token).userId);
      login();      
    } catch (err) {
      console.log('err submit form', err);
    }     
  }
  render() {
    let { from } = this.props.location.state || { from: { pathname: "/" } };
    const { classes } = this.props;

    return (
      <React.Fragment>
        <AuthConsumer>
          {({ isAuth, login }) => (
            <main className={classes.layout}>
              {isAuth ? <Redirect to={from.pathname} /> : (
                <Paper className={classes.paper}>
                  <Avatar className={classes.avatar}>
                    <LockIcon />
                  </Avatar>
                  <Typography component="h1" variant="h5">
                    Kyçu
                  </Typography>
                  <form className={classes.form}>
                    <FormControl margin="normal" required fullWidth>
                      <InputLabel htmlFor="email">Email Adresa</InputLabel>
                      <Input 
                        id="email" 
                        name="email" 
                        autoComplete="email"    
                        value={this.state.email}
                        onChange={this.handleChange('email')} 
                        autoFocus />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                      <InputLabel htmlFor="password">Fjalëkalimi</InputLabel>
                      <Input
                        name="password"
                        type="password"
                        value={this.state.password}
                        onChange={this.handleChange('password')} 
                        id="password"
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={(e) => this.onSubmit(e, login)}
                      className={classes.submit}
                    >
                      Kyçu
                    </Button>
                    <Typography 
                      component={Link} to="register" 
                      style={{ marginTop: '20px', textDecoration: 'none' }} 
                      color="secondary"
                    >
                      Nuk ke user? Regjistrohu
                    </Typography>
                   
                  </form>
                </Paper>
              ) }
              
            </main>
          )}
        </AuthConsumer>
      </React.Fragment>
    );
  }
}

LogIn.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LogIn);

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import axios from 'axios';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  dense: {
    marginTop: 16,
  },
  menu: {
    width: 200,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});
const axiosConfig = {
  headers: {
    Authorization: ""
  }
}

class Form extends React.Component {
  constructor(props) { 
    super(props);
    this.state = {
      thesisTitle: '',
      thesisAbstract: '',
      thesisCategory: ''
    };
    axiosConfig.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleClick = async (e) => {
    e.preventDefault();
    try {
      const params = {
        title: this.state.thesisTitle,
        description: this.state.thesisAbstract,
        category: this.state.thesisCategory
      }
      const response = axios.post('/api/thesis', params, axiosConfig);
      console.log('sucessfully added user', response);
    } catch (err) {
      console.error('error creating thesis', err);
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <Grid container>
        <Grid item sm={12} lg={6}>
          <form className={classes.container}>
            <TextField
              id="outlined-name"
              label="Titulli"
              className={classes.textField}
              fullWidth
              value={this.state.thesisTitle}
              onChange={this.handleChange('thesisTitle')}
              margin="normal"
              variant="outlined"
            />
            <TextField
              id="outlined-multiline-static"
              label="Abstrakti"
              multiline
              fullWidth
              rows="15"
              value={this.state.thesisAbstract}
              onChange={this.handleChange('thesisAbstract')}
              className={classes.textField}
              margin="normal"
              variant="outlined"
            />
            <TextField
              id="outlined-name"
              label="Fusha"
              className={classes.textField}
              fullWidth
              value={this.state.thesisCategory}              
              onChange={this.handleChange('thesisCategory')}
              helperText="Fusha apo kategoria, për shembull, Data Science, Web Development..."
              margin="normal"
              variant="outlined"
            />
            <Button fullWidth variant="contained" color="primary" className={classes.button} onClick={this.handleClick}>
              Send
              <Icon className={classes.rightIcon}>send</Icon>
            </Button>

            FILE PATH <br />
            keywords <br />
            profi <br />
          </form>
        </Grid>
      </Grid>
    )
  }
}

Form.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Form);

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import green from '@material-ui/core/colors/green';
import MySnackbarContentWrapper from './CostumizedSnackBars';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import axios from 'axios';

// THIS NEED REFACTORING

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  success: {
    backgroundColor: green[600],
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  error: {
    backgroundColor: theme.palette.error.dark,
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
  input: {
    display: 'none',
  },
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    display: 'flex',
    width: '94%',
    margin: '20px auto'
  },
  content: {
    flex: '1 0 auto',
  },
  button: {
    marginRight: theme.spacing.unit*3,
  }
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
      thesisCategory: '',
      thesisFile: '',
      snackBarVariant: 'info',
      snackBarMessage: '',
      thesisFileName: '',
      snackBarOpen: false,
      thesisProffesorId: '',
      labelWidth: 0,
      mentors: []

    };
    axiosConfig.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }

  async componentDidMount() {
    const mentorsResponse = await axios.get('/api/user?type=1');
    this.setState({
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
      mentors: mentorsResponse.data.data.map(({ id, firstname, lastname }) => ({ 
        id, 
        displayName: `${firstname} ${lastname}` 
      }))
    })
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  fileOnChange = event => {
    this.setState({
      thesisFile: event.target.files[0],
      thesisFileName: event.target.files[0].name
    })
  }

  handleClick = async event => {
    event.preventDefault();
    try {
      const fd = new FormData();
      fd.append('thesisPDF', this.state.thesisFile, this.state.thesisFile.name);
      fd.append('title', this.state.thesisTitle);
      fd.append('description', this.state.thesisAbstract);
      fd.append('category', this.state.thesisCategory);
      fd.append('professorId', 1);
      fd.append('studentId', 2);
      
      const response = await axios.post('/api/thesis', fd, axiosConfig);
      this.setState({ 
        snackBarOpen: true,
        snackBarVariant: 'success',
        snackBarMessage: 'Tema u ngarkua me sukses.'
      });

    } catch (err) {
      console.error('error creating thesis', err);
      this.setState({ 
        snackBarOpen: true,
        snackBarVariant: 'error',
        snackBarMessage: 'Pati një gabim gjatë ngarkimit të temës, provoni përsëri.'
      });
    }
  }

  handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ snackBarOpen: false });
  };

  handleSelectChange = event => {
    this.setState({ [event.target.name]: event.target.value });
    console.log([event.target.name], event.target.value);
  };

  render() {
    const { classes } = this.props;

    return (
      <>
        <Grid container>
          <Grid item sm={12} lg={6}>
            <form className={classes.container} autoComplete="off">
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
              <FormControl fullWidth variant="outlined" className={classes.formControl}>
                <InputLabel
                  ref={ref => {
                    this.InputLabelRef = ref;
                  }}
                  htmlFor="outlined-thesisProffesorId-simple"
                >
                  Mentori
                </InputLabel>
                <Select
                  value={this.state.thesisProffesorId}
                  onChange={this.handleSelectChange}
                  input={
                    <OutlinedInput
                      labelWidth={this.state.labelWidth}
                      name="thesisProffesorId"
                      id="outlined-thesisProffesorId-simple"
                    />
                  }
                >
                  {this.state.mentors.map(({id, displayName}) => (
                    <MenuItem value={id}>{displayName}</MenuItem>
                  ))}
                </Select>
              </FormControl> 
              <Paper className={classes.root} elevation={1}>
              <input
                accept="image/*"
                className={classes.input}
                id="outlined-button-file"
                // value={this.state.thesisFile}              
                onChange={event => this.fileOnChange(event)}
                multiple
                type="file"
              />
              <label htmlFor="outlined-button-file">
                <Button variant="outlined" component="span" className={classes.button}>
                  Ngarko temën
                </Button>
              </label>
              <Typography style={{ lineHeight: '3em' }} variant='caption'>
                {this.state.thesisFileName ? this.state.thesisFileName : 'Nuk është zgjedhur ndonjë fajl'}
              </Typography>
            </Paper>
              <Button fullWidth variant="contained" color="primary" className={classes.button} onClick={this.handleClick}>
                Send
                <Icon className={classes.rightIcon}>send</Icon>
              </Button>

              keywords <br />
            </form>
          </Grid>
        </Grid>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.snackBarOpen}
          autoHideDuration={6000}
          onClose={this.handleSnackbarClose}
        >
          <MySnackbarContentWrapper
            onClose={this.handleSnackbarClose}
            variant={this.state.snackBarVariant}
            message={this.state.snackBarMessage}
          />
        </Snackbar>
      </>
    )
  }
}

Form.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Form);

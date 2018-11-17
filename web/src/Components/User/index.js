import React, { Component } from 'react';
import Loader from '../Layout/Loader';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import PropTypes from 'prop-types';
import chipDataConfig from '../Theses/Thesis/chipDataConfig';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import FileCopy from '@material-ui/icons/FileCopy';
import EditIcon from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import Divider  from '@material-ui/core/Divider';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Icon from '@material-ui/core/Icon';
import AlertDialog from '../Style/AlertDialog';
import ThesisByUser from './ThesisByUser';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing.unit * 2,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  paper: {
    padding: theme.spacing.unit * 2,
    color: theme.palette.text.secondary,
    width: '100%'
  }, 
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  chip: {
    margin: theme.spacing.unit,
  },
  button: {
    marginTop: theme.spacing.unit *3,
    marginRight: theme.spacing.unit*3,
  },
  anchorDownload: {
    textDecorationLine: 'none',
    textDecoration: 'none',
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'inherit',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

const axiosConfig = {
  headers: {
    Authorization: ''
  }
}

function getStyles(name, that) {
  return {
    fontWeight:
      that.state.keywordsSelected.indexOf(name) === -1
        ? that.props.theme.typography.fontWeightRegular
        : that.props.theme.typography.fontWeightMedium,
  };
}

class User extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      type: '',
      displayName: '',
      registrationYear: '',
      showEditForm: false,
      department: '',
      program: '',
      theses: []
    }
    axiosConfig.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  deleteThesis = async event => {
    const { match: { params } } = this.props;
    const { thesisId } = params;
    
    try {
      await axios.delete(`/api/thesis/${thesisId}`, axiosConfig);
      this.setState({
        agreeToDeleteDialogOpen: false
      });
    } catch (err) {
      console.log('error deleting thesis');
      console.log(err);
    }
  }

  agreeToDelete = () => {
    this.setState({
      agreeToDelete: true
    })
  }

  handleClickAlertOpen = () => {
    this.setState({ agreeToDeleteDialogOpen: true })
  };

  handleAlertClose = () => {
    this.setState({ agreeToDeleteDialogOpen: false });
  };

  async componentDidMount() {
    const { match: { params } } = this.props;
    const { userId } = params;
    const userData = await this.getUserData(userId)
    const { 
      firstname, lastname, email, type, registration_year,
      department, program
    } = userData[0];
    const thesesByUser = await axios.get(`/api/thesis/byUser/${userId}`);

    this.setState({
      email,
      type,
      firstname,
      lastname,
      department, 
      program,
      displayName: `${firstname} ${lastname}`,
      registrationYear: registration_year,
      theses: thesesByUser.data.data
    });
  }

  showEditForm = () => {
    this.setState({
      showEditForm: !this.state.showEditForm
    });
  }

  handleClick = async (e) => {
    e.preventDefault();
    const { match: { params } } = this.props;
    const { userId } = params;

    const updateBody = { 
      email: this.state.email, 
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      registration_year: this.state.registrationYear,
    }
    try {
      await axios.put(`/api/user/${userId}`, updateBody, axiosConfig);
      const userData = await this.getUserData(userId);
      const { 
        firstname, lastname, email, type, registration_year
      } = userData[0];
      this.setState({
        showEditForm: false,
      });

      this.setState({
        email,
        type,
        firstname,
        lastname,
        displayName: `${firstname} ${lastname}`,
        registrationYear: registration_year,
      })
    } catch (err) {
      console.log('err trying to update status');
    }
  }

  getUserData = async (userId) => {
    const userData = await axios.get(`/api/user/${userId}`);
    return userData.data.data;
  }

  render() {
    const { classes, match: { params } } = this.props;
    let { userId } = params;
    userId = userId && Number(userId);
    const currentUserId = localStorage.getItem('userId') && Number(localStorage.getItem('userId'));
    const {
      displayName, type, registrationYear, email, theses,
      department, program, showEditForm
    } = this.state;
    return <>
      {!displayName ? <Loader /> : null}
      <Grid spacing={24} container>
        <Grid item xs={12} sm={6}>
          <Paper className={classes.root}>
            <Typography variant='h5'>{displayName}</Typography>
            <Table className={classes.table}>
              <TableBody>
                <TableRow key="name">
                  <TableCell component="th" scope="row">Emri dhe mbiemri</TableCell>
                  <TableCell>{displayName}</TableCell>
                </TableRow>  
                <TableRow key="name">
                  <TableCell component="th" scope="row">Roli</TableCell>
                  <TableCell>{type === 0 ? 'Student' : 'Mentor / Profesor'}</TableCell>
                </TableRow>

                {type === 0 ? <>
                  <TableRow key="name">
                    <TableCell component="th" scope="row">Viti i regjitrimit</TableCell>
                    <TableCell>{registrationYear}</TableCell>
                  </TableRow>
                  <TableRow key="name">
                    <TableCell component="th" scope="row">Departmenti</TableCell>
                    <TableCell>{department}</TableCell>
                  </TableRow>
                  <TableRow key="name">
                    <TableCell component="th" scope="row">Programi</TableCell>
                    <TableCell>{program}</TableCell>
                  </TableRow>
                </> : null}

              </TableBody>
            </Table>
            {currentUserId === userId ? <>
              <Divider style={{ marginBottom: '10px' }} />
              <Button onClick={this.showEditForm} variant="outlined" size="small" className={classes.button}>
                <EditIcon className={classNames(classes.leftIcon, classes.iconSmall)}/>
                Modifikoje 
              </Button>
              {showEditForm ? <form className={classes.container} autoComplete="off">
                <TextField
                  id="outlined-firstname"
                  label="Emri"
                  className={classes.textField}
                  fullWidth
                  value={this.state.firstname}
                  onChange={this.handleChange('firstname')}
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  id="outlined-lastname"
                  label="Mbiemri"
                  className={classes.textField}
                  fullWidth
                  value={this.state.lastname}
                  onChange={this.handleChange('lastname')}
                  margin="normal"
                  variant="outlined"
                />    
                <TextField
                  id="outlined-registrationYear"
                  label="Viti i regjistrimit"
                  className={classes.textField}
                  fullWidth
                  type="number"
                  value={this.state.registrationYear}
                  onChange={this.handleChange('registrationYear')}
                  margin="normal"
                  variant="outlined"
                />    
                <TextField
                  id="outlined-email"
                  label="Email"
                  className={classes.textField}
                  fullWidth
                  value={this.state.email}
                  onChange={this.handleChange('email')}
                  margin="normal"
                  variant="outlined"
                />    
                    
                <Button fullWidth variant="contained" color="primary" className={classes.button} onClick={this.handleClick}>
                  Përditëso
                  <Icon className={classes.rightIcon}>send</Icon>
                </Button>
              </form> : null}
                         
            </> : null}
          </Paper>
        </Grid>
        <Grid  justify="center" item xs={12} sm={4}>
          <Paper className={classes.paper}>
            <ThesisByUser theses={this.state.theses} />
          </Paper>
        </Grid>
      </Grid>
      <AlertDialog handleClickAlertOpen={this.handleClickAlertOpen} handleAlertClose={this.handleAlertClose}  deleteThesis={this.deleteThesis} open={this.state.agreeToDeleteDialogOpen} />
    </>
  }
}



User.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles,  { withTheme: true })(User);

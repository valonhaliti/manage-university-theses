import React, { Component } from 'react';
import Loader from '../Layout/Loader';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import moment from 'moment';
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
import LocalPrintshop from '@material-ui/icons/LocalPrintshop';
import SimilarityThesis from './SimilarityThesis';
import EditIcon from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import Divider  from '@material-ui/core/Divider';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import AlertDialog from '../Style/AlertDialog';
import TextField from '@material-ui/core/TextField'
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Snackbar from '@material-ui/core/Snackbar';
import MySnackbarContentWrapper from '../Forms/CostumizedSnackBars';


const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing.unit * 2,
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
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
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

class Thesis extends Component {
  constructor() {
    super();
    this.state = {
      title: '',
      astract: '',      
      snackBarVariant: 'info',
      snackBarMessage: '',
      snackBarOpen: false,
      category: '',
      status: '',
      created_date: '',
      mentorId: '',
      mentorName: '',
      similarityReport: '',
      statusOfThesis: '',
      showStatusEditForm: false,
      keywords: [],
      agreeToDelete: false,
      agreeToDeleteDialogOpen: false,
      pproved_by_departament_date: '', 
      delegation_date: '',
      delegation_list: '',
      delegation_list_to_update: '',
      datePicker: '',
      published_date: ''
    }
    axiosConfig.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }

  handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ snackBarOpen: false });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
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
    await this.getThesisData();    
    this.compareThesis();
  }

  getThesisData = async () => {
    const { match: { params } } = this.props;
    const { thesisId } = params;
    const { data: { data } } = await axios.get(`/api/thesis/${thesisId}`);
    const { 
      title, description: abstract, category, filepath, 
      created_date, status, professorId, professorFirstName, professorLastName,
      studentId, studentFirstName, studentLastName,
      keywords, approved_by_departament_date,
      delegation_date, published_date, delegation_list
    } = data[0];


    this.setState({
      title, abstract, category, status, created_date, delegation_list,
      approved_by_departament_date, delegation_date, published_date, 
      mentorId: professorId,
      mentorName: `${professorFirstName} ${professorLastName}`,
      studentId,
      studentName: `${studentFirstName} ${studentLastName}`,
      keywords, filepath
    });

  }

  compareThesis = async (compareAgain=false) => {
    const { match: { params } } = this.props;
    const { thesisId } = params;
    let similarityReport = await axios.get(`/api/compareTheses/getSimilarity/${thesisId}`);
    if (similarityReport.data.data.length === 0 || compareAgain) {
      await axios.get(`/api/compareTheses/compareWithAll/${thesisId}`);
      similarityReport = await axios.get(`/api/compareTheses/getSimilarity/${thesisId}`)
    }
    this.setState({
      similarityReport: similarityReport.data.data[0] && similarityReport.data.data[0].ratings
    });
  }

  showStatusEditForm = () => {
    this.setState({
      showStatusEditForm: !this.state.showStatusEditForm
    });
  }

  changeStatus = async (e) => {
    e.preventDefault();
    const { match: { params } } = this.props;
    const { thesisId } = params;

    const updateBody = { 
      statusOfThesis: this.state.statusOfThesis, 
      delegation_list: this.state.delegation_list_to_update || null,
      datePicker: this.state.datePicker || null
    }
    try {
      await axios.put(`/api/thesis/${thesisId}`, updateBody, axiosConfig);
      this.setState({
        showStatusEditForm: false,
        status: this.state.statusOfThesis 
      });
      await this.getThesisData();
    } catch (err) {
      if (err.response.data.message === 'Three months should pass after it gets approved by department.') {
        this.setState({ 
          snackBarOpen: true,
          snackBarVariant: 'error',
          snackBarMessage: 'Duhet të kalojnë 3 muaj pas aprovimit të departamentin në mënyrë që të jetë e gatshme për komision.'
        });
      }
    }
  }

  render() {
    const { classes, match: { params } } = this.props;
    const { thesisId } = params;
    const { 
      title, abstract, category, status, keywords,
      mentorId, mentorName,
      studentId, studentName,
      similarityReport, filepath, delegation_list,
      approved_by_departament_date, delegation_date, published_date
    } = this.state;
    const userId = localStorage.getItem('userId') && Number(localStorage.getItem('userId'));
    const fileName = filepath && filepath.split('\\')[1];
    const chipData = chipDataConfig[status];
    return <>
      {!title ? <Loader /> : null}
      <Grid spacing={24} container>
        <Grid item xs={12} sm={8}>
          <Paper className={classes.paper}>
            <Grid alignItems="center" container>
              <Grid item xs={12} sm={10}>
                <Typography variant="h3">
                  {title}
                </Typography>
                <Typography gutterBottom variant="h5">
                  nga studenti <Link className={classes.link} to={`/user/${studentId}`}>{studentName}</Link>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={2}>
                <a className={classes.anchorDownload} href={fileName ? `/api/thesis/download/${fileName}` : false} target="_blank" rel="noopener noreferrer">
                  <Button disabled={fileName == null} variant="outlined" size="small" className={classes.button}>
                    <FileCopy className={classNames(classes.leftIcon, classes.iconSmall)}/>
                    Shkarko
                  </Button>
                </a>
              </Grid>
            </Grid>
            <Typography variant="h6">
              Abstrakti
            </Typography>
            <Typography paragraph>
              {abstract}
            </Typography>
            
            <Typography variant="h6">
              Mentori
            </Typography>
            <Typography paragraph>
              <Link className={classes.link} to={`/user/${mentorId}`}>{mentorName}</Link> 
            </Typography>
            
            <Grid container>
              <Grid item xs={6}>
                <Typography variant="h6">
                  Fjalët kyçe
                </Typography>
                <Typography paragraph>
                  {keywords.map(keyword => 
                    <Chip variant="outlined" label={keyword} className={classes.chip} />
                  )}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="h6">
                  Fusha
                </Typography>
                <Typography paragraph>
                  {category}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="h6">
                  Statusi
                </Typography>
                <Typography paragraph>
                  <Chip variant="outlined" label={chipData && chipData.label} color={chipData && chipData.color} />
                </Typography>
              </Grid>
            </Grid>
            
              {(userId === studentId || userId === mentorId) ? (
                <>
                <Divider style={{ marginBottom: '20px' }} />
                <Typography variant="h6">Statusi i temës</Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        Statusi
                      </TableCell>
                      <TableCell>
                        Aksioni
                      </TableCell>
                      <TableCell>
                        Data
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    
                  {status !== 'shqyrtim' && status !== 'diskutim' ? <TableRow>
                      <TableCell>
                        Tema u aprovua nga mentori
                      </TableCell>
                      <TableCell>
                        <Button style={{marginTop: '-5px'}} variant="outlined" size="small" className={classes.button} component={Link} to={`/kerkesaPerLejimTeTemes/${title}/${mentorName}/${studentId}`}>
                          <LocalPrintshop className={classNames(classes.leftIcon, classes.iconSmall)}/>
                          Kërkesa
                        </Button> 
                      </TableCell>
                      <TableCell>
                        -
                      </TableCell>
                    </TableRow> : null}
                    {approved_by_departament_date ? <TableRow>
                      <TableCell>
                      Tema u aprovua nga departamenti
                      </TableCell>
                      <TableCell>
                        -
                      </TableCell>
                      <TableCell>
                      {moment(approved_by_departament_date).format('LL')}
                      </TableCell>
                    </TableRow> : null}
                    {delegation_date ? <TableRow>
                      <TableCell>
                      Komisioni {delegation_list} u caktua
                      </TableCell>
                      <TableCell>
                        -
                      </TableCell>
                      <TableCell>
                      {moment(delegation_date).format('LL')}
                      </TableCell>
                    </TableRow> : null} 
                    {published_date ? <TableRow>
                      <TableCell>
                      Tema u mbrojt
                      </TableCell>
                      <TableCell>
                        -
                      </TableCell>
                      <TableCell>
                      {moment(published_date).format('LL')}
                      </TableCell>
                    </TableRow> : null}
                    
                    

                  </TableBody>
                </Table>
               
                <Divider />
                {userId === mentorId ? (
              <>
                <Divider style={{ marginBottom: '20px' }} />
                <Button onClick={this.showStatusEditForm} variant="outlined" size="small" className={classes.button}>
                  <EditIcon className={classNames(classes.leftIcon, classes.iconSmall)}/>
                  Modifikoje statusin
                </Button>
                {this.state.showStatusEditForm ? (
                <form>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="statusOfThesis-simple">Statusi</InputLabel>
                    <Select
                      value={this.state.statusOfThesis}
                      onChange={this.handleChange}
                      inputProps={{
                        name: 'statusOfThesis',
                        id: 'statusOfThesis-simple',
                      }}
                    >
                      {Object.keys(chipDataConfig).map(chip => <MenuItem value={chip}>{chipDataConfig[chip].label}</MenuItem>)}
                    </Select>
                    <FormControl className={classes.formControl}>
                      {this.state.statusOfThesis === 'komisioni-i-caktuar' ?  <TextField
                        id="outlined-name"
                        label="Anëtarët e komisionit"
                        className={classes.textField}
                        fullWidth
                        required
                        value={this.state.delegation_list_to_update}
                        onChange={this.handleChange}
                        inputProps={{
                          name: 'delegation_list_to_update',
                          id: 'delegation_list_to_update-simple',
                        }}
                        margin="normal"
                        variant="outlined"
                      /> : null}
                      {this.state.statusOfThesis === 'komisioni-i-caktuar' || 
                        this.state.statusOfThesis === 'e-kryer' ||
                        this.state.statusOfThesis === 'aprovuar-departamenti' ? <TextField
                        id="date"
                        label="Data"
                        type="date"
                        value={this.state.datePicker}
                        onChange={this.handleChange}
                        className={classes.textField}
                        inputProps={{
                          name: 'datePicker',
                          id: 'datePicker-simple',
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      /> : null}
                    </FormControl>
                    <Button 
                      onClick={(e) => this.changeStatus(e)}
                      fullWidth size="small" variant="contained" color="primary" className={classes.button}>
                      Modifikoje
                    </Button>
                    
                  </FormControl>
                </form>
                ) : null}
                
              </>
              ): 
              <>
                <Button component={Link} to={`/thesis/update/${thesisId}`} variant="outlined" size="small" className={classes.button}>
                  <EditIcon className={classNames(classes.leftIcon, classes.iconSmall)}/>
                  Modifiko
                </Button>
                <Button onClick={this.handleClickAlertOpen} variant="outlined" size="small" className={classes.button}>
                  <Delete className={classNames(classes.leftIcon, classes.iconSmall)}/>
                  Fshij
                </Button>
              </>
              }
                
                </>
              ) : null}
          </Paper>
        </Grid>
        <Grid  justify="center" item xs={12} sm={4}>
          <Paper className={classes.paper}>
            <SimilarityThesis similarityReport={similarityReport} compareThesis={this.compareThesis} />
          </Paper>
        </Grid>
      </Grid>
      <AlertDialog handleClickAlertOpen={this.handleClickAlertOpen} handleAlertClose={this.handleAlertClose}  deleteThesis={this.deleteThesis} open={this.state.agreeToDeleteDialogOpen} />
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
  }
}

Thesis.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Thesis);

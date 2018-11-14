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
import Input from '@material-ui/core/Input';
import Chip from '@material-ui/core/Chip';
import AddIcon from '@material-ui/icons/AddCircle';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';


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

function getStyles(name, that) {
  return {
    fontWeight:
      that.state.keywordsSelected.indexOf(name) === -1
        ? that.props.theme.typography.fontWeightRegular
        : that.props.theme.typography.fontWeightMedium,
  };
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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
      mentors: [],
      keywordsSelected: [],
      keywords: [],
      newKeywords: false,
      newKeywordsString: ''
    };
    axiosConfig.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }

  async componentDidMount() {
    const { match: { params } } = this.props;
    const { thesisId } = params;

    
    const mentorsResponse = await axios.get('/api/user?type=1');
    const keywords = await axios.get('/api/keyword');
   

    const thesisResponse = await axios.get(`/api/thesis/${thesisId}`);
    const { 
      title: thesisTitle, description: thesisAbstract, category: thesisCategory,
      professorId: thesisProffesorId, keywords: keywordsSelected
    } = thesisResponse.data.data[0];

    this.setState({
      keywords: keywords.data.data,
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef) && ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
      mentors: mentorsResponse.data.data.map(({ id, firstname, lastname }) => ({ 
        id, 
        displayName: `${firstname} ${lastname}`,
      })),
      thesisTitle,
      thesisAbstract,
      thesisCategory,
      thesisProffesorId,
      keywordsSelected
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
    const { match: { params } } = this.props;
    const { thesisId } = params;

    let validateInputResponse = this.validateInput();
    if (validateInputResponse) {
      this.setState({ 
        snackBarOpen: true,
        snackBarVariant: 'error',
        snackBarMessage: validateInputResponse
      });
      return;
    }
    let keywords = [
      ...this.state.keywords
        .filter(keyword => this.state.keywordsSelected.includes(keyword.name)), 
      ...this.state.newKeywordsString
        .split(',')
        .map(keyword => ({
          name: keyword.trim() 
        }))
        .filter(({name}) => name.length > 0)
    ];
    keywords = JSON.stringify(keywords);
    try {
      const fd = new FormData();
      fd.append('thesisPDF', this.state.thesisFile, this.state.thesisFile.name);
      fd.append('title', this.state.thesisTitle);
      fd.append('description', this.state.thesisAbstract);
      fd.append('category', this.state.thesisCategory);
      fd.append('keywords', keywords);
      fd.append('professorId', this.state.thesisProffesorId);
      
      const response = await axios.put(`/api/thesis/${thesisId}`, fd, axiosConfig);
      this.setState({ 
        snackBarOpen: true,
        snackBarVariant: 'success',
        snackBarMessage: 'Tema u përditësua me sukses.'
      });

    } catch (err) {
      if (err.response.data.message === "You can't modify this thesis anymore.") {
        this.setState({ 
          snackBarOpen: true,
          snackBarVariant: 'error',
          snackBarMessage: 'Tema është aprovuar dhe ju nuk mund ta modifikoni më.'
        });
      } else {
        this.setState({ 
          snackBarOpen: true,
          snackBarVariant: 'error',
          snackBarMessage: 'Pati një gabim gjatë ngarkimit të temës, provoni përsëri.'
        });
      }
    }
  }

  validateInput = () => {
    const { thesisTitle, thesisAbstract, thesisProffesorId } = this.state;
    let msg = (field) => `Tema duhet të ketë një ${field}, mbusheni fushen provoni sërish.`;

    if (!thesisTitle) return msg('titull');
    else if (!thesisAbstract) return msg('abstrakt');
    else if (!thesisProffesorId) return msg('mentor');
    return null;
  }

  handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ snackBarOpen: false });
  };

  handleSelectChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChipChange = event => {
    this.setState({ keywordsSelected: event.target.value });
  };

  addNewKeywords = event => {
    event.preventDefault()
    this.setState({ newKeywords: true });
  }

  render() {
    const { classes } = this.props;

    return <>
      <Grid container>
        <Grid item sm={12} lg={6}>
          <form className={classes.container} autoComplete="off">
            <TextField
              id="outlined-name"
              label="Titulli"
              className={classes.textField}
              fullWidth
              required
              value={this.state.thesisTitle}
              onChange={this.handleChange('thesisTitle')}
              margin="normal"
              variant="outlined"
            />
            <TextField
              id="outlined-multiline-static"
              label="Abstrakti"
              multiline
              required
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
            <FormControl required  fullWidth variant="outlined" className={classes.formControl}>
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
            
            <FormControl fullWidth className={classes.formControl}>
              <InputLabel htmlFor="select-multiple-chip">Fjalët kyçe</InputLabel>
              <Select
                multiple
                value={this.state.keywordsSelected}
                onChange={this.handleChipChange}
                input={<Input id="select-multiple-chip" />}
                renderValue={selected => (
                  <div className={classes.chips}>
                    {selected.map(value => (
                      <Chip key={value} label={value} className={classes.chip} />
                    ))}
                  </div>
                )}
                MenuProps={MenuProps}
              >
                {this.state.keywords.map(({id, name}) => (
                  <MenuItem key={id} value={name} style={getStyles(name, this)}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {!this.state.newKeywords ? <MenuItem onClick={event => this.addNewKeywords(event)}>   
              <ListItemIcon><AddIcon /></ListItemIcon>
              <ListItemText primary="Shto fjalë kyçe të reja"/>
            </MenuItem> : null}
            
            {this.state.newKeywords ? <TextField
              id="outlined-name"
              label="Fjalët kyçe të reja"
              className={classes.textField}
              fullWidth
              value={this.state.newKeywordsString}              
              onChange={this.handleChange('newKeywordsString')}
              helperText='Fjalët kyçe të aplikacionit tuaj, ndani me presje. P.sh., "sistemi rekomandues, perzgjedhje e ushqimit"...'
              margin="normal"
              variant="outlined"
            /> : null}

            <Paper className={classes.root} elevation={1}>
            <input
              className={classes.input}
              id="outlined-button-file"
              // value={this.state.thesisFile}              
              onChange={event => this.fileOnChange(event)}
              multiple
              type="file"
            />
            <label htmlFor="outlined-button-file">
              <Button variant="outlined" component="span" className={classes.button}>
                Përditëso fajlin
              </Button>
            </label>
            <Typography style={{ lineHeight: '3em' }} variant='caption'>
              {this.state.thesisFileName ? this.state.thesisFileName : 'Nuk është zgjedhur ndonjë fajl'}
            </Typography>
          </Paper>
            <Button fullWidth variant="contained" color="primary" className={classes.button} onClick={this.handleClick}>
              Përditëso
              <Icon className={classes.rightIcon}>send</Icon>
            </Button>
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
  }
}

Form.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles,  { withTheme: true })(Form);

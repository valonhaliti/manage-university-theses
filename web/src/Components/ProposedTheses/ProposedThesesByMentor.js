import React, { Component } from 'react';
import Loader from '../Layout/Loader';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TextField from '@material-ui/core/TextField';
import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';


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
  listItem: {
    borderBottom:' 1px solid red'
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

class ProposedThesesByMentor extends Component {
  state = {
    proposedThesesList: [],
    thesisTitle: '',
    mentor: {},
    loader: true
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  async componentDidMount() {
    const { match: { params } } = this.props;
    const { mentorId } = params;
    const { data: { data } } = await axios.get(`/api/user/${mentorId}`);
    this.setState({
      loader: false,
      mentor: data[0],
      proposedThesesList: data[0].proposed_theses_list && JSON.parse(data[0].proposed_theses_list)
    });
    axiosConfig.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }

  changeTakenThesis(idx) {
    const proposedThesesList = [...this.state.proposedThesesList];
    proposedThesesList[idx].taken = true;
    this.setState({ proposedThesesList }, async () => {
      await this.update();
      const thesisTitle = this.state.proposedThesesList[idx].title;
      this.props.history.push(`/create/${thesisTitle}`);        
    });
  } 

  removeProposedThesis(idx) {
    const proposedThesesList = [...this.state.proposedThesesList];
    proposedThesesList.splice(idx, 1);
    this.setState({ proposedThesesList });
  }

  // Add new thesis title in proposed theses
  onSubmit = async event => {
    event.preventDefault();
    const proposedThesesList = [...this.state.proposedThesesList];
    
    // Don't add duplicated titles
    for (const proposedThesis of proposedThesesList) {
      if (this.state.thesisTitle === proposedThesis.title) return;
    }
    
    proposedThesesList.push({
      title: this.state.thesisTitle,
      taken: false
    })
    this.setState({ proposedThesesList }, async () => await this.update());
  }

  update = async () => {
    const { classes, match: { params } } = this.props;
    const { mentorId } = params;
    const updateBody = {
      proposedThesesList: this.state.proposedThesesList && JSON.stringify(this.state.proposedThesesList)
    };
    console.log(updateBody);
    try {
      await axios.put(`/api/user/updateProposedTheses/${mentorId}`, updateBody);
      console.log('hooray, it worked');
    } catch (err) {
      console.log('err');

    }
  }

  render() {
    const { classes, match: { params } } = this.props;
    const { firstname, lastname } = this.state.mentor;
    const { mentorId } = params;
    return <>
      {this.state.loader ? <Loader /> :
      <Grid container>
        <Grid item md={8} lg={5}>        
          <Paper className={classes.root}>
            <Typography variant="h5">Temat e propozuara nga {firstname} {lastname}</Typography>
            <Table>
              <TableBody>
                  {this.state.proposedThesesList && this.state.proposedThesesList.map((proposedThesis, idx) => <TableRow>
                    <TableCell>
                    {proposedThesis.title}
                    </TableCell>
                    <TableCell>
                      {proposedThesis.taken ? <Typography color="secondary">E nxënë</Typography> : 
                      <Typography color="primary">E lirë</Typography>}
                    </TableCell>
                    <TableCell>
                      {mentorId === localStorage.getItem('userId') ? 
                        <Button variant="outlined" onClick={() => this.removeProposedThesis(idx)}>
                          Fshije
                        </Button> 
                      : 
                        <>
                        {!proposedThesis.taken ? <Button variant="outlined" onClick={() => this.changeTakenThesis(idx)}>
                          Merre
                        </Button> : 
                        null}
                      </>
                      }
                    </TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>
            {mentorId === localStorage.getItem('userId') ? 
              <form onSubmit={this.onSubmit}>
                <TextField
                  id="outlined-name"
                  label="Shto nje propozim per teme dhe shtyp enter"
                  className={classes.textField}
                  fullWidth
                  required
                  value={this.state.thesisTitle}
                  onChange={this.handleChange('thesisTitle')}
                  margin="normal"
                  variant="outlined"
                />
              </form>
            : null}
          </Paper>
        </Grid>
      </Grid>
      } 
    </>
  }
}

ProposedThesesByMentor.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProposedThesesByMentor);

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
    color: green[600],
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
    thesisTitle: ''
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
    // this.setState({
    //   proposedThesesList: data[0].proposed_theses_list && JSON.parse(data[0].proposed_theses_list)
    // })
    this.setState({
      proposedThesesList: [
        {
          title: 'Web app 1',
          taken: false
        },
        {
          title: 'Web app 2',
          taken: false
        },
        {
          title: 'Web app 3',
          taken: true
        },
        {
          title: 'Web app 4',
          taken: false
        },{
          title: 'Web app 5',
          taken: true
        }
      ]
    })
  }

  changeTakenThesis(idx) {
    const proposedThesesList = [...this.state.proposedThesesList];
    proposedThesesList[idx].taken = true;
    this.setState({ proposedThesesList })
  } 

  onSubmit = (e) => {
    e.preventDefault();
    const proposedThesesList = [...this.state.proposedThesesList];
    
    for (const proposedThesis of proposedThesesList) {
      if (this.state.thesisTitle === proposedThesis.title) return;
    }
    
    proposedThesesList.push({
      title: this.state.thesisTitle,
      taken: false
    })
    this.setState({ proposedThesesList })
  }

  render() {
    const { classes, match: { params } } = this.props;
    const { mentorId } = params;
    return <>
      {this.state.proposedThesesList.length === 0 ? <Loader /> :
      <Grid container>
        <Grid item md={5}>        
          <Paper className={classes.root}>
            <Typography variant="h5">Temat e propozuara nga mentori</Typography>
            <Table>
              <TableBody>
                  {this.state.proposedThesesList.map((proposedThesis, idx) => <TableRow>
                    <TableCell>
                    {proposedThesis.title}
                    </TableCell>
                    <TableCell>
                      {proposedThesis.taken ? <Typography color="secondary">E nxënë</Typography> : 
                      <Typography color="primary">E lirë</Typography>}
                    </TableCell>
                    <TableCell>
                      <Button variant="outlined" onClick={() => this.changeTakenThesis(idx)}>
                        Merre
                      </Button>
                    </TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>
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

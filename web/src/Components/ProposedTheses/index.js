import React, { Component } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import { withStyles } from '@material-ui/core/styles';
import Loader from '../Layout/Loader'
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  card: {
    padding: theme.spacing.unit*3
  }
});

class ProposedTheses extends Component {
  state = {
    mentorsWithProposedTheses: [],
    mentor: false,
    loader: true
  }

  async componentDidMount() {
    const { data: { data } } = await axios.get('/api/user?type=1');
    this.setState({
      mentor: data.some(mentor => mentor.id === (localStorage.getItem('userId') && Number(localStorage.getItem('userId')))),
      mentorsWithProposedTheses: data.filter(mentor => mentor.proposed_theses_list), 
      loader: false 
    });
  }

  render() {    
    const { classes } = this.props;
    return <>
      {this.state.mentor ? 
        <Button variant="outlined" color="primary" component={Link} to={`proposed-theses/${localStorage.getItem('userId')}`}>
          Krijo një listë tënden
        </Button>    
      : null}
      {this.state.loader === 0 ? <Loader /> :
      <Grid container spacing={24}>
        {this.state.mentorsWithProposedTheses.map(mentor => <Grid item sm={12} md={6} lg={3}>
          <Card className={classes.card}>
            <Typography variant="h6">Temat e diplomës të propozuara nga {mentor.firstname} {mentor.lastname}</Typography>
            <Button variant="outlined" color="primary" fullWidth component={Link} to={`proposed-theses/${mentor.id}`}>SHIKO TEMAT</Button>
          </Card>  
        </Grid>
        )}
      </Grid> 
      }
    </>
  }
}


ProposedTheses.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProposedTheses);

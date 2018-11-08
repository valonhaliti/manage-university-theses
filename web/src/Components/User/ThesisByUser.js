import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import ThesisCard from '../Thesis/ThesisCard';

const styles = theme => ({
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const ThesisByUser = props => {
  const { theses } = props;
  
  return <>
    <Typography variant="h6">Tema</Typography>
    {theses && theses.map(thesis => <ThesisCard {...thesis} />)}
  </>   
}

ThesisByUser.propTypes = {
  classes: PropTypes.object.isRequired
};


export default withStyles(styles)(ThesisByUser);

import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import ThesisCard from './ThesisCard';

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

const SimilarityThesis = props => {
  let { similarityReport } = props;
  similarityReport = similarityReport && JSON.parse(similarityReport); 
  
  return <>
    <Typography variant="h6">Ngjashmëria me tema tjera</Typography>
    {similarityReport && similarityReport.map(thesis => <ThesisCard {...thesis} />)}
    <Button color="secondary" onClick={() => props.compareThesis(true)} size="small">Krahasoji sërish</Button>
  </>   
}

SimilarityThesis.propTypes = {
  classes: PropTypes.object.isRequired
};


export default withStyles(styles)(SimilarityThesis);

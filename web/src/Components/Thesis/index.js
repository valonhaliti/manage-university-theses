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
import SimilarityThesis from './SimilarityThesis';

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
  chip: {
    margin: theme.spacing.unit,
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

class Thesis extends Component {
  constructor() {
    super();
    this.state = {
      title: '',
      astract: '',
      category: '',
      status: '',
      created_date: '',
      mentorId: '',
      mentorName: '',
      similarityReport: '',
      keywords: []
    }
  }

  async componentDidMount() {
    const { match: { params } } = this.props;
    const { thesisId } = params;
    const { data: { data } } = await axios.get(`/api/thesis/${thesisId}`);
    const { 
      title, description: abstract, category, filepath, 
      created_date, status, professorId, professorFirstName, professorLastName,
      studentId, studentFirstName, studentLastName,
      keywords
    } = data[0];

    this.setState({
      title, abstract, category, status, created_date, 
      mentorId: professorId,
      mentorName: `${professorFirstName} ${professorLastName}`,
      studentId,
      studentName: `${studentFirstName} ${studentLastName}`,
      keywords, filepath
    });

    this.compareThesis();
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
      similarityReport: similarityReport.data.data[0].ratings
    });
  }

  render() {
    const { classes } = this.props;
    const { 
      title, abstract, category, created_date, status, keywords,
      mentorId, mentorName,
      studentId, studentName,
      similarityReport, filepath
    } = this.state;
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
                <a className={classes.anchorDownload} href={`/api/thesis/download/${fileName}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outlined" size="small" className={classes.button}>
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
                    <Chip label={keyword} className={classes.chip} />
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
                  <Chip label={chipData && chipData.label} color={chipData && chipData.color} />
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid  justify="center" item xs={12} sm={4}>
          <Paper className={classes.paper}>
            <SimilarityThesis similarityReport={similarityReport} compareThesis={this.compareThesis} />
          </Paper>
        </Grid>
      </Grid>
    </>
  }
}

Thesis.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Thesis);

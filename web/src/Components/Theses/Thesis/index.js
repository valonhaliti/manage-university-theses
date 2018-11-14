import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography'
import FileCopy from '@material-ui/icons/FileCopy';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { truncateWithEllipses } from '../../../utils/truncate';
import { Link } from 'react-router-dom';
import moment from 'moment';
import chipDataConfig from './chipDataConfig';
import Tooltip from '@material-ui/core/Tooltip';
import 'moment/locale/sq';

moment.locale('sq');

const styles = theme => ({
  card: {
    maxWidth: 400
  },
  button: {
    margin: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
  anchorDownload: {
    textDecorationLine: 'none',
    textDecoration: 'none',
  }
})

const Thesis = ({ 
  classes, 
  id: thesisId, 
  title, 
  description, 
  category, 
  status: stateOfThesis, 
  filepath, 
  createdDate,
  professor_id: mentorId 
  }) => {
  const chipData = chipDataConfig[stateOfThesis];
  const fileName = filepath && filepath.split('\\')[1];

  const userId = localStorage.getItem('userId') && Number(localStorage.getItem('userId'));

  return (
    <div>
      <Card className={classes.card}>
        <CardActionArea>
          <CardContent>
            {mentorId === userId ? 
              (
                <Tooltip title="Kjo temë është nën mentorimin tim" placement="top">
                  <Typography variant="h5" component="h2" color="primary">
                    {title}
                  </Typography>
                </Tooltip>
              )
              :
              (
              <Typography variant="h5" component="h2" >
                {title}
              </Typography>
              )
            }
            <Typography color={chipData && chipData.color}>
              {chipData && chipData.label}
            </Typography>
            <Typography gutterBottom variant="subtitle1" >
              {category} - {moment(createdDate).format('LL')}
            </Typography>
            <Typography gutterBottom component="p">
              {truncateWithEllipses(description)}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <a className={classes.anchorDownload} href={fileName ? `/api/thesis/download/${fileName}` : false} target="_blank" rel="noopener noreferrer">
                <Button disabled={fileName == null} variant="outlined" size="small" className={classes.button}>
                  <FileCopy className={classNames(classes.leftIcon, classes.iconSmall)}/>
                  Shkarko
                </Button>
              </a>
            </Grid>
            <Grid item>
              <Button component={Link} to={`/thesis/${thesisId}`} size="small" color="primary" variant="outlined" >
                Më shumë
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </div>
  );
}

Thesis.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Thesis);

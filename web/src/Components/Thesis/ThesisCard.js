import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { truncateWithEllipses } from '../../utils/truncate';

const styles = theme => ({
  card: {
    marginTop: 10,
  },
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
  anchorDownload: {
    textDecorationLine: 'none',
    textDecoration: 'none',
  },
});

const ThesisCard = ({ id, title, rating, target, classes }) => <Card className={classes.card}>
  <CardContent>
    <Typography variant="h5" component="h2">
      {title}
    </Typography>
    <Typography className={classes.title} color="textSecondary" gutterBottom>
      Ngjashmëria: {(rating*100).toFixed(2)}%
    </Typography>
    <Typography component="p">
      {truncateWithEllipses(target)}
    </Typography>
  </CardContent>
  <CardActions>
    <a className={classes.anchorDownload} href={`/thesis/${id}`} target="_blank" rel="noopener noreferrer">
      <Button color="primary" size="small">Më shumë</Button>
    </a>
  </CardActions>
</Card>


ThesisCard.propTypes = {
  classes: PropTypes.object.isRequired
};


export default withStyles(styles)(ThesisCard);

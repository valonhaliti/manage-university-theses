import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import {withStyles } from '@material-ui/core/styles';

const styles = {
  card: {
    maxWidth: 345
  }
};

function Thesis(props) {
  const { classes } = props;

  return (
    <div>
      <Card className={classes.card}>
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2" >
              {props.title}
            </Typography>
            <Typography component="p">
              {props.description}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" color="primary">
            Më shumë
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}

Thesis.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Thesis);

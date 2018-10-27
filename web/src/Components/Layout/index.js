import React, { Component } from 'react'; 
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import LeftNav from './LeftNav';
import Header from './Header';

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
  toolbar: theme.mixins.toolbar,
});

class Layout extends Component {  
  render() {
    const { classes, children } = this.props;
    return (
      <div className={classes.root}>
        <CssBaseline />
        <Header />
        <LeftNav />
        <main className={classes.content}>
          <div className={classes.toolbar} />
          { children }
        </main>
      </div>
    );
  }
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Layout);

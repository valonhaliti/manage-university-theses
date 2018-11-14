import React, { Component } from 'react'; 
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import { compose } from 'recompose'
import listItems from './listItemData.json';
import ListItemComponent from './ListItemComponent';
let dividerKey = 0;
const drawerWidth = 240;
const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
  toolbar: theme.mixins.toolbar,
});

class LeftNav extends Component { 
  render() {
    const { classes, location: { pathname } } = this.props;
    return (
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.toolbar} />
          <List>
            {listItems.map(listItem => {
              let listItemComp = <ListItemComponent 
                key={listItem.listItemKey}
                link={listItem.link}
                text={listItem.text}
                icon={listItem.icon}
                isSelected={`/${listItem.link}` === pathname}
              />
              return <>
              {listItem.private ? (localStorage.getItem('token') ? listItemComp : null) : listItemComp}
              
              {listItem.divider ? <Divider key={++dividerKey} /> : null}
            </>})}
          </List>
        </Drawer>
    );
  }
}

LeftNav.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withRouter,
  withStyles(styles)
)(LeftNav);

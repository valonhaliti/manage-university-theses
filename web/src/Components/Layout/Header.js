import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import { AuthConsumer } from '../../AuthContext';
import Button from '@material-ui/core/Button';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';


const styles = theme => ({
  grow: {
    flexGrow: 1,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  button: {
    color: 'inherit',
    margin: theme.spacing.unit,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
});

class Header extends React.Component {
  state = {
    anchorEl: null,
    mobileMoreAnchorEl: null,
    searchQuery: ''
  };

  handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = event => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    })
  }

  goToMyProfile = () => {
    localStorage.getItem('userId') && this.props.history.push(`/user/${localStorage.getItem('userId')}`);    
  }

  search = () => {
    this.props.history.push(`/search/${this.state.searchQuery}`);
  }  

  renderMenu = logOut => {
    const { anchorEl } = this.state;
    const isMenuOpen = Boolean(anchorEl);
    
    return (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={this.goToMyProfile}>Profili</MenuItem>
        <MenuItem onClick={logOut}>Çkyçu</MenuItem>
      </Menu>
    );
  }

  renderMobileMenu = logOut => {
    const { mobileMoreAnchorEl } = this.state;
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    
    return (<Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={this.handleMobileMenuClose}
    >
    <MenuItem onClick={this.goToMyProfile}>
      <IconButton color="inherit">
        <AccountCircle />
      </IconButton>
      Profili
    </MenuItem>
    <MenuItem onClick={logOut}>Çkyçu</MenuItem>
    </Menu>)
  }
    

  render() {
    const { anchorEl, mobileMoreAnchorEl } = this.state;
    const { classes } = this.props;
    const isMenuOpen = Boolean(anchorEl);


    return (
      <AuthConsumer>
      {({ isAuth, logOut }) => (
        <div className={classes.root}>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Typography style={{ textDecoration: 'none'}} component={Link} to="/" className={classes.title} variant="h6" color="inherit" noWrap>
              Menaxhimi i temave te diplomes
            </Typography>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Kërko…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                value={this.state.searchQuery}
                onChange={this.handleChange('searchQuery')}
                onKeyPress={event => { if (event.key === 'Enter') this.search() }}
              />
            </div>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              {
                isAuth 
                ? 
                  <IconButton
                    aria-owns={isMenuOpen ? 'material-appbar' : null}
                    aria-haspopup="true"
                    onClick={this.handleProfileMenuOpen}
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton> 
                : 
                  <Button 
                    variant="outlined"
                    className={classes.button}
                    component={Link} to="/login"
                  >
                    Kyçu
                  </Button>
              }
            </div>
            <div className={classes.sectionMobile}>
              { 
                isAuth 
                ? 
              <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit">
                <MoreIcon />
              </IconButton>
                : 
                <Button 
                  variant="outlined"
                  className={classes.button}
                  component={Link} to="/login"
                >
                  Kyçu
                </Button>
            }
            
            </div>
          </Toolbar>
        </AppBar>
        {this.renderMenu(logOut)}
        {this.renderMobileMenu(logOut)}
      </div>
      )}  
      </AuthConsumer>
      
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withRouter,
  withStyles(styles)
)(Header);


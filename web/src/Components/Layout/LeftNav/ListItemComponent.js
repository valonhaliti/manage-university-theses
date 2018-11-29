import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/AddCircle';
import PendingThesesIcon from '@material-ui/icons/ThumbsUpDown';
import ApprovedThesesIcon from '@material-ui/icons/DoneOutline';
import PermIdentity from '@material-ui/icons/PermIdentity';
import DoneAll from '@material-ui/icons/DoneAll';
import Layers from '@material-ui/icons/Layers';
import InfoIcon from '@material-ui/icons/Info';
import FilterNone from '@material-ui/icons/FilterNone';
import { Link } from 'react-router-dom';

const getIcon = nameOfIcon => {
  switch (nameOfIcon) {
    case 'AddIcon':
      return <AddIcon color="primary" />;
    case 'InfoIcon':
      return <InfoIcon />;
    case 'PendingThesesIcon':
      return <PendingThesesIcon />;
    case 'ApprovedThesesIcon':
      return <ApprovedThesesIcon />;
    case 'PermIdentity':
      return <PermIdentity />;
    case 'DoneAll':
      return <DoneAll />;
    case 'GenerateReport':
      return <FilterNone />;
    case 'Layers':
      return <Layers />;
    default:
      return null;
  }
}

export default props => {
  const { link, listItemKey, isSelected, text, icon } = props;
  return <ListItem 
    component={Link} 
    to={`/${link}`} 
    button 
    key={listItemKey}
    selected={isSelected}
  >        
    <ListItemIcon>{getIcon(icon)}</ListItemIcon>
    <ListItemText primary={text} />              
  </ListItem> 
}

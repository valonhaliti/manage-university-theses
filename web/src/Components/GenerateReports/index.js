import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ThesesGrid from '../Theses/ThesesGrid';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
 
const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    minWidth: 300,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});

class GenerateReports extends Component {
  state = {
    theses: [],
    currentStatus: 'aprovuar-departamenti',
    labelWidth: 0,
    fromDatePicker: '',
    toDatePicker: '',
    loader: true
  }

  async componentDidMount() {
    const { data: { data } } = await axios.get('/api/thesis');
    this.setState({
      theses: data,
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef) && ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
      loader: false 
    });
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleClick = async event => {
    let { currentStatus, fromDatePicker, toDatePicker } = this.state;
    if (!currentStatus || !fromDatePicker || !toDatePicker) return;
    const { data: { data } } = await axios.get(`/api/thesis/byStatus/${currentStatus}/${fromDatePicker}/${toDatePicker}`);
    this.setState({
      theses: data
    });
  }

  render() {
    const { match: { params, path }, classes } = this.props;
    return <>
      <form className={classes.root}>
        <TextField
          id="date"
          label="Prej datës"
          type="date"
          variant="outlined"

          value={this.state.fromDatePicker}
          onChange={this.handleChange}
          className={classes.textField}
          inputProps={{
            name: 'fromDatePicker',
            id: 'fromDatePicker-simple',
          }}
          InputLabelProps={{
            shrink: true,
          }}
        /> 
        <TextField
          id="date"
          label="Deri më"
          type="date"
          variant="outlined"
          value={this.state.toDatePicker}
          onChange={this.handleChange}
          className={classes.textField}
          inputProps={{
            name: 'toDatePicker',
            id: 'fromDatePicker-simple',
          }}
          InputLabelProps={{
            shrink: true,
          }}
        /> 
        <FormControl required variant="outlined" className={classes.formControl}>
          <InputLabel
            ref={ref => {
              this.InputLabelRef = ref;
            }}
            htmlFor="outlined-currentStatus-simple"
          >
            Statusi
          </InputLabel>
          <Select
            value={this.state.currentStatus}
            onChange={this.handleChange}
            input={
              <OutlinedInput
                labelWidth={this.state.labelWidth}
                name="currentStatus"
                id="outlined-currentStatus-simple"
              />
            }
          >
            <MenuItem value='aprovuar-departamenti'>Aprovuar nga departamenti</MenuItem>
            <MenuItem value='komisioni-i-caktuar'>Komisioni i caktuar</MenuItem>
            <MenuItem value='e-kryer'>E kryer (mbrojtur)</MenuItem>
          </Select>
          
        </FormControl> 
        <Button variant="contained" color="primary" className={classes.button} onClick={this.handleClick}>
          Gjenero
        </Button>
      </form>
      <ThesesGrid params={params} path={path} theses={this.state.theses} loader={this.state.loader} />
    </>;
  }
}

GenerateReports.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GenerateReports);

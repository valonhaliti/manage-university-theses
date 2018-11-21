import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {truncateWithEllipses } from '../../utils/truncate';
import ReactToPrint from "react-to-print";

import moment from 'moment';

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

const statusDispayName = {
  "aprovuar-departamenti": "E aprovuar nga departamenti",
  "komisioni-i-caktuar": "Komisioni u caktua",
  "e-kryer": "E kryer"
}

class GenerateReports extends Component {
  state = {
    theses: [],
    currentStatus: 'aprovuar-departamenti',
    labelWidth: 0,
    fromDatePicker: '',
    mentors: [],
    currentMentor: '',
    toDatePicker: '',
    loader: true
  }

  async componentDidMount() {
    const mentorsResponse = await axios.get('/api/user?type=1');

    this.setState({
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef) && ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
      loader: false,
      mentors: mentorsResponse.data.data.map(({ id, firstname, lastname }) => ({ 
        id, 
        displayName: `${firstname} ${lastname}`,
      })),
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
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel
            ref={ref => {
              this.InputLabelRef = ref;
            }}
            htmlFor="outlined-currentMentor-simple"
          >
            Filtro sipas mentorit
          </InputLabel>
          <Select
            value={this.state.currentMentor}
            onChange={this.handleChange}
            input={
              <OutlinedInput
                labelWidth={this.state.labelWidth}
                name="currentMentor"
                id="outlined-currentMentor-simple"
              />
            }
          >
             {this.state.mentors.map(({id, displayName}) => (
                <MenuItem value={id}>{displayName}</MenuItem>
              ))}
          </Select>
        </FormControl> 
        <Button variant="contained" color="primary" className={classes.button} onClick={this.handleClick}>
          Gjenero
        </Button>
      </form>
      {/* <ThesesGrid params={params} path={path} theses={this.state.theses} loader={this.state.loader} /> */}
      
      {this.state.theses.length > 0 ? 
      <>
        <ReactToPrint
          trigger={() => <a href="#">
          <Button  variant="outlined">Printoje</Button>          
          </a>}
          content={() => this.componentRef}
        /> 
        <Paper
        ref={el => (this.componentRef = el)}
        id="section-to-print" className={classes.root}>
        <Typography style={{ padding: "10px 70px 10px 20px" }} variant="h6">
          Të gjitha temat 
          me statusin: {statusDispayName[this.state.currentStatus]}, nga data: {moment(this.state.fromDatePicker).format('LL')} deri më {moment(this.state.toDatePicker).format('LL')} 
        </Typography>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Titulli</TableCell>
              <TableCell>Abstrakti</TableCell>
              <TableCell>Statusi</TableCell>
              <TableCell>Studenti</TableCell>
              <TableCell>Mentori</TableCell>
              <TableCell>Data</TableCell>
            </TableRow>
          </TableHead>
         <TableBody>
          {this.state.theses.map(row => {
            if (this.state.currentMentor && row.professor_id !== this.state.currentMentor) return null;
            return (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.title}
                </TableCell>
                <TableCell>{truncateWithEllipses(row.description, 100)}</TableCell>
                <TableCell>{statusDispayName[row.status]}</TableCell>
                <TableCell>{`${row.studentFirstName} ${row.studentLastName}`}</TableCell>
                <TableCell>{`${row.mentorFirstName} ${row.mentorLastName}`}</TableCell>
                <TableCell>{row.status === 'e-kryer' ? moment(row.published_date).format('LL')
                :  (row.status === 'komisioni-i-caktuar' ? moment(row.delegation_date).format('LL') :
                moment(row.approved_by_departament_date).format('LL'))}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      </Paper>
      </>
      : null}

    </>;
  }
}

GenerateReports.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GenerateReports);

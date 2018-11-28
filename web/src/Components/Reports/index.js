import React, { Component } from 'react';
import axios from 'axios';
import KerkesaPerLejim from './KerkesaPerLejim';
import Button from '@material-ui/core/Button';

class Report extends Component {
  state = {
    studentName: '',
    department: '',
    program: ''
  }

  async componentDidMount() {
    const { match: { params, path } } = this.props;
    console.log({path});
    if (path.startsWith('/kerkesaPerLejimTeTemes')) {
      const { firstname, lastname, department, program } = await this.getUserData(params.userId);
      console.log({ firstname, lastname, department, program});
      this.setState({
        studentName:`${firstname} ${lastname}`,
        departmentName: department, 
        programiStudimor: program,
        thesisTitle: params.thesisTitle,
        mentorName: params.mentorName
      })
    }
  }

  
  getUserData = async (userId) => {
    const userData = await axios.get(`/api/user/${userId}`);
    return userData.data.data[0];
  }

  render() {
    const { match: { path } } = this.props;
    return <> 
      {path.startsWith('/kerkesaPerLejimTeTemes') ? 
      <>
        <div style={{textAlign: 'center'}}>
          <a style={{textDecoration: 'none'}} href="javascript:window.print()">
            <Button  variant="outlined">Printoje</Button>
          </a>
        </div>
    
        <KerkesaPerLejim id={"section-to-print"} {...this.state}  /> 
      </>: 
      null }
    </>; 
  }
}

export default Report;

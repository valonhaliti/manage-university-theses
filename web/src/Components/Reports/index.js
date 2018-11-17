import React, { Component } from 'react';
import axios from 'axios';
import KerkesaPerLejim from './KerkesaPerLejim';
import PrintButton from './PrintButton';

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
    const { match: { params, path } } = this.props;
    return <> 
      {path.startsWith('/kerkesaPerLejimTeTemes') ? 
      <>
        <PrintButton id={"printable"} label={"Printoje kërkesën për lejimin e temës së diplomës"} />
        <KerkesaPerLejim id={"printable"} {...this.state}  /> 
      </>: 
      null }
    </>; 
  }
}

export default Report;

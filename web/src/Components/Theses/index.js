import React, { Component } from 'react';
import ThesesGrid from './ThesesGrid';
import axios from 'axios';

class ThesisList extends Component {
  state = {
    theses: []
  }

  async componentDidMount() {
    const { data: { data } } = await axios.get('/api/thesis');
    this.setState({ theses: data });
  }

  render() {
    const { match: { params } } = this.props;
    return <ThesesGrid params={params} theses={this.state.theses} />
  }
}

export default ThesisList;

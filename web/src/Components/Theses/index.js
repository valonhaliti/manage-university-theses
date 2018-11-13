import React, { Component } from 'react';
import ThesesGrid from './ThesesGrid';
import axios from 'axios';

class ThesisList extends Component {
  state = {
    theses: [],
    loader: true
  }

  async componentDidMount() {
    const { data: { data } } = await axios.get('/api/thesis');
    this.setState({ theses: data, loader: false });
  }

  render() {
    const { match: { params, path } } = this.props;
    return <ThesesGrid params={params} path={path} theses={this.state.theses} loader={this.state.loader} />
  }
}

export default ThesisList;

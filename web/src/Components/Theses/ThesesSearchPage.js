import React, { Component } from 'react';
import axios from 'axios';
import ThesesGrid from './ThesesGrid';

class ThesesSearchPage extends Component {
  state = {
    theses: [],
    searchQuery: '',
    loader: true
  }

  getThesesBySearchQuery = async (searchQuery) => {
    const { data: { data } } = await axios.get(`/api/search?searchQuery=${searchQuery}`);
    return data;
  }

  async componentDidMount() {
    this.setState({ loader: true })
    const { match: { params } } = this.props;
    const searchQuery = params.searchQuery;
    const theses = await this.getThesesBySearchQuery(searchQuery);
    this.setState({ theses, loader: false });
  }

  // FIXME: componentWillReceiveProps is deprecated 
  async componentWillReceiveProps(props) {
    this.setState({ loader: true })
    const { match: { params } } = props;
    const searchQuery = params.searchQuery;
    const theses = await this.getThesesBySearchQuery(searchQuery);
    this.setState({ theses, loader: false });
  }

  render() {
    const { match: { params } } = this.props;
    return <ThesesGrid params={params} theses={this.state.theses} loader={this.state.loader} />
  }
}

export default ThesesSearchPage;

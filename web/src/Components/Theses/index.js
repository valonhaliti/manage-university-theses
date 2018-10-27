import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Thesis from './Thesis';
import axios from 'axios';

class ThesisList extends Component {
  constructor() {
    super();
    this.state = {
      theses: []
    }
  }

  async componentDidMount() {
    const { data: { data } } = await axios.get('/api/thesis');
    this.setState({ theses: data });
  }

  render() {
    const { match: { params } } = this.props;
    return (
      <div>
        <Grid container spacing={24} style={{padding: 24}}>
          {this.state.theses
            .filter(thesis => params.status !== undefined ? thesis.status === Number(params.status) : true)
            .map((thesis, idx) => (
              <Grid key={idx} item xs={12} sm={6} lg={4} xl={3}>
                <Thesis key={idx} {...thesis} />
              </Grid>))}
        </Grid>
      </div>
    )
  }
}

export default ThesisList;

import React, { Component } from 'react';
import Thesis from './Thesis';
import Grid from '@material-ui/core/Grid';

import axios from 'axios';

class ThesisList extends Component {
  constructor() {
    super();
    this.state = {
      theses: []
    }
  }

  async componentDidMount() {
    const response = await axios.get('http://localhost:3001/thesis');
    this.setState({ theses: response.data.data });
  }

  render() {
    return (
      <div>
        {this.state.theses ? (
          <Grid container spacing={24} style={{padding: 24}}>
            {this.state.theses.map((thesis, idx) => (
              <Grid item xs={12} sm={6} lg={4} xl={3}>
                <Thesis key={idx} title={thesis.title} description={thesis.description} />
              </Grid>
            ))}
          </Grid>
        ) : null}
        
      </div>
    )
  }
}

export default ThesisList;

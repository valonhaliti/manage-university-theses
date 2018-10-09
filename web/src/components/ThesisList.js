import React, { Component } from 'react';
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
        const response = await axios.get('http://localhost:3001/thesis');
        this.setState({ theses: response.data.data });
    }

    render() {
        return (
            <div>
                {this.state.theses.map((thesis, idx) => <Thesis key={idx} title={thesis.title} description={thesis.description} />)}
            </div>
        )
    }
}

export default ThesisList;

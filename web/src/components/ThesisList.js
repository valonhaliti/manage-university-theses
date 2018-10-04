import React, { Component } from 'react';
import Thesis from './Thesis';

import axios from 'axios';

class ThesisList extends Component {
    state = {
        theses: []
    }

    componentDidMount() {
        axios.get('http://localhost:3001/thesis')
            .then(res => {
                const theses = res.data.data;
                this.setState({ theses });
            });
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

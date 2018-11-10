import React from 'react';
import Grid from '@material-ui/core/Grid';
import Loader from '../Layout/Loader';
import Thesis from './Thesis';
import Typography from '@material-ui/core/Typography';

export default props => {
    const { params, theses, loader } = props;
    return (
      <>
        {loader ? <Loader /> : <>{theses.length === 0 ? <Typography>Nuk u gjet asgjë. Sigurohuni që nuk keni bërë gabime drejtshkrimore.</Typography> : null}</>}
        <Grid container spacing={24} style={{padding: 24}}>
          {theses
            .filter(thesis => params.status !== undefined ? thesis.status === Number(params.status) : true)
            .map((thesis, idx) => (
              <Grid key={idx} item xs={12} sm={6} lg={4} xl={3}>
                <Thesis key={idx} {...thesis} />
              </Grid>))}
        </Grid>
      </>
    )
}

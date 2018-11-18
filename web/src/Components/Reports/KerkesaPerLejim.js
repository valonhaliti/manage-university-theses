import React from 'react';
import Page from './Page';
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider';
import moment from 'moment';

const KerkesaPerLejim = ({
  id, 
  studentName="Valon Haliti", 
  departmentName='Matematikës', 
  programiStudimor='Shkenca kompjuterike',
  thesisTitle="Clustering of words",
  mentorName="Mentor Mentori"
  }) => (<Page singleMode={true} id={id} class="A4">
  <Grid container>
    <Grid item xs={2}>
      <img style={{maxHeight: '80px'}} src="/University_of_Prishtina_logo.svg" alt="Logo e Universiteti te Prishtines" />
    </Grid>
    <Grid item style={{textAlign: 'center' }} xs={10}>
      <h3 style={{ margin: 0, fontSize: '12pt' }}>UNIVERSITETI I PRISHTINËS</h3>
      <h3 style={{ margin: 0, fontSize: '12pt' }}>“HASAN PRISHTINA”</h3>
      <h3 style={{ margin: 0, fontSize: '12pt' }}>FAKULTETI I SHKENCAVE MATEMATIKE NATYRORE</h3>
      <p style={{ margin: 0, fontSize: '11pt' }}>Rr. Xhorxh Bush, 10000 Prishtinë, Republika e Kosovës</p>
      <p style={{ margin: 0, fontSize: '12pt' }}>Tel: +381-38-249-873 • E-mail: dekanati@uni-pr.edu • www.uni-pr.edu</p>
    </Grid>
    <Grid item xs={12}>
    <Divider />
    <Grid style={{ fontSize: '11pt', margin: '10px 0'}} container>
      <Grid item xs={6}></Grid>
      <Grid item xs={3}>
        Ref. nr.,
      </Grid>
      <Grid item xs={3}>
        Prishtinë, dt.
      </Grid>
    </Grid>
    <Divider />
    </Grid>
    <Grid item style={{fontSize: '12pt'}} xs={12}>
      <h3 style={{textAlign: 'center' }} >K Ë R K E S Ë</h3>
      <h4>Për: Këshillin e  Departamentit të <u>{departmentName}</u>.</h4>
      <h4 style={{marginBottom: -15}}>Prej: <u>{studentName}</u>,</h4>
      <h4>student/e i/e departamentit <u>{departmentName}</u>, programi studimor <u>{programiStudimor}</u>.</h4>
      <h4>Lënda: Kërkesë për lejimin e punimit të diplomës bachelor dhe caktimin e mentorit</h4>
      <p style={{marginBottom: -15}}>Në bazë të Rregullores për studime bachelor në FSHMN, kërkoj nga departamenti të më lejoj punimin e diplomës bachelor </p>
      <h4><u>{thesisTitle}</u></h4>
      <p>mentori: <u>{mentorName}</u></p>
      <p >Kërkesës ia bashkëngjisë:</p>
      <ol style={{padding: '0 30pt 30pt 30pt'}}>
        <li>Certifikatën e notave (me të cilën vërtetohet se ka akumuluar të  paktën 50% te ETCS në vitin e fundit të studimeve)</li>
        <li>Vërtetimin për statusin e studentit</li>
        <li>CV</li>
      </ol>
    </Grid>
    <Grid style={{fontSize: '12pt'}} item xs={12}>
      <Grid container>
        <Grid item xs={7}>
          <p>Më {moment().format('LL')}, Prishtinë</p>
          <p>Tel.: _______________</p>
          <p>Email: _________________</p>
        </Grid>
        <Grid item xs={5}>
          <p>Nënshkrimi i studentit</p>
          <p>
            ______________________
          </p>
        </Grid>
      </Grid>
    </Grid>
  </Grid>
</Page>);

export default KerkesaPerLejim;

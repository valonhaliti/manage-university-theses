import React from 'react';
import Page from './Page';
import moment from 'moment';

const KerkesaPerLejim = ({
  id, 
  studentName="Valon Haliti", 
  departmentName='Matematikës', 
  programiStudimor='Shkenca kompjuterike',
  thesisTitle="Clustering of words",
  mentorName="Mentor Mentori"
  }) => (<Page singleMode={true} id={id}>
  <div style={{display: 'flex'}}>
    <div style={{width: '100px'}}>
      <img src="/University_of_Prishtina_logo.svg" alt="Logo e Universiteti te Prishtines" />
    </div>
    <div style={{textAlign: 'center', paddingLeft: '40px'}}>
      <h3 style={{marginBottom: -15}}>UNIVERSITETI I PRISHTINËS</h3>
      <h3 style={{marginBottom: -15}}>“HASAN PRISHTINA”</h3>
      <h3 style={{marginBottom: -15}}>FAKULTETI I SHKENCAVE MATEMATIKE NATYRORE</h3>
      <p style={{marginBottom: -15}}>Rr. Xhorxh Bush, 10000 Prishtinë, Republika e Kosovës</p>
      <p style={{marginBottom: -15}}>Tel: +381-38-249-873 • E-mail: dekanati@uni-pr.edu • www.uni-pr.edu</p>
    </div>
  </div>
  <br />
  <hr />

  <div style={{display: 'flex'}}>
    <div style={{ width: '300px',  }}>
    </div>
    <div style={{ width: '200px',  }}>
      Ref. nr. 
    </div>
    <div>
      Prishtinë, dt.
    </div>
  </div>
  <hr />
  <h1 style={{textAlign: 'center'}} >K Ë R K E S Ë</h1>

  <h4>Për: Këshillin e  Departamentit të <u>{departmentName}</u>.</h4>
  <h4 style={{marginBottom: -15}}>Prej: <u>{studentName}</u>,</h4>
  <h4>student/e i/e departamentit <u>{departmentName}</u>, programi studimor <u>{programiStudimor}</u>.</h4>
  <h4>Lënda: Kërkesë për lejimin e punimit të diplomës bachelor dhe caktimin e mentorit</h4>
  <p style={{marginBottom: -15}}>Në bazë të Rregullores për studime bachelor në FSHMN, kërkoj nga departamenti të më lejoj punimin e diplomës bachelor </p>
  <h4><u>{thesisTitle}</u></h4>
  <p>mentori: <u>{mentorName}</u></p>
  <br />
  <p >Kërkesës ia bashkëngjisë:</p>
  <ol style={{padding: '0 30px 30px 30px'}}>
    <li>Certifikatën e notave (me të cilën vërtetohet se ka akumuluar të  paktën 50% te ETCS në vitin e fundit të studimeve)</li>
    <li>Vërtetimin për statusin e studentit</li>
    <li>CV</li>
  </ol>
  <br />
  <div style={{display: 'flex'}}>
    <div style={{ width: '70%' }}>
      <p>Më {moment().format('LL')}, Prishtinë</p>
      <p>Tel.: _______________</p>
      <p>Email: _________________</p>
    </div>
    <div>
      Nënshkrimi i studentit <br />
      ______________________
    </div>
  </div>

</Page>);

export default KerkesaPerLejim;

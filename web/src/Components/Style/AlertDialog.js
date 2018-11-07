import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

class AlertDialog extends React.Component {

  render() {
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.props.handleAlertClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Dëshironi ta fshini temën?"}</DialogTitle>
          <DialogActions>
            <Button onClick={this.props.handleAlertClose} color="primary">
              Jo
            </Button>
            <Button onClick={this.props.deleteThesis} color="primary" autoFocus>
              Po
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default AlertDialog;

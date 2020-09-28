import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import propTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { MyContext } from '../../contexts';

class RemoveProdDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
    };
  }

  handleSubmit = async(openSnackBar) => {
    this.setState({loader: true});
    const { data, onSubmit, onClose } = this.props;
    const response = await onSubmit({id: data.originalId});
    if(response.error) openSnackBar('Error', 'danger');
    if(response.response) openSnackBar('Deleted Successfully', 'success')
    this.setState({loader: false});
    onClose()
  }

  render = () => {
    const {
      onClose, open,
    } = this.props;
    const { loader } = this.state;
    return (
      <Dialog onClose={() => onClose()} fullWidth aria-labelledby="simple-dialog-title" open={open}>
        <DialogTitle id="simple-dialog-title">Remove Product</DialogTitle>
        <div>
          <DialogContentText>
              Do you really want to delete product ?
          </DialogContentText>
        </div>
        <DialogContent>
          <DialogActions>
            <Button onClick={() => onClose()} variant="contained">
              Cancel
            </Button>
            <MyContext.Consumer>
              {(value) => (
              <Button
                disabled={loader ? true : false}
                color="primary"
                variant="contained"
                onClick={async() => {
                  this.handleSubmit(value.openSnackBar)
                }}
              >
                <span>
                  {loader ? <CircularProgress size={20} /> : ''}
                </span>
                Delete
              </Button>
              )}
            </MyContext.Consumer>
          </DialogActions>
        </DialogContent>
      </Dialog>
    );
  }
}

RemoveProdDialog.propTypes = {
  onClose: propTypes.func.isRequired,
  open: propTypes.bool.isRequired,
  onSubmit: propTypes.func,
  data: propTypes.object.isRequired,
};

RemoveProdDialog.defaultProps = {
  onSubmit: undefined,
};

export default RemoveProdDialog;

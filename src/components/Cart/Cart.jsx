import React from 'react';
import { graphql } from '@apollo/react-hoc';
import propTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import DialogTitle from '@material-ui/core/DialogTitle';
import { MyContext } from '../../contexts';
import Compose from 'lodash.flowright';
import { Mutation } from '@apollo/react-components';
import { GET_ALL_ORDER } from '../../pages/Home/query';
import { DELETE_ORDER } from '../../pages/Home/mutation';
import { ADD_ORDER_SUB } from '../../pages/Home/subscription';

class CartDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      record: [],
    };
  }

  componentDidMount = () => {
    const { data: { subscribeToMore, refetch } } = this.props;
    subscribeToMore({
      document: ADD_ORDER_SUB,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) return prev;
        if (subscriptionData) {
          return refetch({ skip: 0, limit: 50 });
        }
      },
    });
  }

  deleteOrder = async(id, openSnackBar, deleteOrder, refetch) => {
    try {
      await deleteOrder({ variables: { id }});
      openSnackBar('Order Deleted', 'success');
      refetch({skip: 0, limit: 50 });
    } catch (error) {
      openSnackBar('Error', 'danger');
    }
  }

  render = () => {
    const {
      data: {
        getAllOrder: {
          record = [],
          } = {},
          refetch,
      },
      open, onClose,
    } = this.props;
    const variables = { skip: 0, limit: 50 };
    return (
      <Mutation
        mutation={DELETE_ORDER}
        refetchQueries={[{ query: GET_ALL_ORDER, variables }]}
      >
        {(deleteOrder) => (
          <div>
            <Dialog open={open} fullWidth onClose={onClose} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title" variant="h1">Orders</DialogTitle>
              <DialogContent>
                <div>
                  {
                    !record.length ? ('No Order Remaining... ') : (
                    <Grid container spacing={2}>
                        {record.map(({ _id, product, price, originalId }) => (
                        <Grid key={_id} item xs={6}>
                            <Card variant="outlined" display="inline-block" margin="2px">
                                <CardContent>
                                    <Typography variant="h5" component="h2">
                                        ProductName:
                                        <br />
                                        {product}
                                    </Typography>
                                    <Typography color="textSecondary" variant="h6">
                                      Price: {price}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                <MyContext.Consumer>
                                {(value) => (
                                <Button
                                size="small"
                                color="primary"
                                onClick={async() => {
                                    await this.deleteOrder(originalId, value.openSnackBar, deleteOrder, refetch);
                                }}
                                >
                                Delete
                                </Button>
                                )}
                                </MyContext.Consumer>
                                </CardActions>
                            </Card>
                        </Grid>
                        ))}
                    </Grid>
                  )}
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={onClose} color="primary">
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
          </div>
    )}
    </Mutation>
    )
  }
}
CartDialog.propTypes = {
  open: propTypes.bool.isRequired,
  onClose: propTypes.func.isRequired,
};

export default Compose(graphql(GET_ALL_ORDER, {
    options: { variables: { skip: 0, limit: 50 } },
  }))(CartDialog);

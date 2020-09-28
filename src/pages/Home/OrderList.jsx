import React, { useState } from 'react';
import { graphql } from '@apollo/react-hoc';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import ShoppingCartTwoToneIcon from '@material-ui/icons/ShoppingCartTwoTone';
import propTypes from 'prop-types';
import AddCircleTwoToneIcon from '@material-ui/icons/AddCircleTwoTone';
import {
  Cart, AddOrderDialog,
} from '../../components';
import { Mutation } from '@apollo/react-components';
import Compose from 'lodash.flowright';
import { TableComponent } from '../../components';
import { GET_ALL_PRODUCT } from './query';
import { CREATE_ORDER } from './mutation';

const useStyles = {
  button: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
};

function OrderList(props) {
  const [ state, setState ] = useState({
    all: true,
    open: false,
    order: 'asc',
    orderBy: 'Date',
    page: 0,
    addOpen: false,
    removeOpen: false,
    rowData: {},
    rowsPerPage: 20,
  });

  const handleClickOpen = () => {
    setState({ ...state, open: true });
  }

  const handleClose = async() => {
    await setState({...state, open: false, addOpen: false, });
  }

  const handleCartClose = async() => {
    await setState({...state, open: false, addOpen: false, });
  }

  const onSubmitHandler = (createOrder) => async(values) => {
    try {
      const { product, price, all } = values;
      const response = await createOrder({variables: { product, price, all }});
      return { response };
    } catch (error) {
      return { error };
    }
  }

  const handleSort = (value) => {
    const { orderBy, order } = state;
    const isAsc = orderBy === value && order === 'asc';
    const data = isAsc ? 'desc' : 'asc';
    setState({
      ...state,
      order: data,
      orderBy: value,
    });
  }

  const handleAddDialogOpen = (values) => {
    setState({ ...state, addOpen: true, rowData: values });
  }

  const handleChangePage = (refetch) => async(event, newPage) => {
    const { rowsPerPage, all } = state;
    refetch({ skip: newPage * rowsPerPage, limit: rowsPerPage, all });
    setState({ page: newPage });
  }

  const {
    data: {
      getAllProduct: {
        records = [],
        count = 0,
        } = {},
      loading,
      refetch,
    },
    classes,
  } = props;
  const {
    open, order, orderBy, page, addOpen, rowData,
    rowsPerPage,
  } = state;
  const variables = { skip: page * rowsPerPage, limit: rowsPerPage, all: true };

  return (
        <Mutation
          mutation={CREATE_ORDER}
          refetchQueries={[{ query: GET_ALL_PRODUCT, variables }]}
        >
          {(createOrder) => (
            <>
              <div className={classes.button}>
              <Tooltip title="Cart" aria-label="add">
                  <Fab color="primary">
                    <ShoppingCartTwoToneIcon onClick={handleClickOpen}/>
                  </Fab>
                </Tooltip>
              </div>
              <TableComponent
                id={page}
                data={records}
                column={[{
                  field: 'name',
                  label: 'Name',
                },
                {
                  field: 'price',
                  label: 'Price',
                },
                {
                    field: 'description',
                    label: 'Description',
                },
                {
                  field: 'createdAt',
                  label: 'Date',
                  align: 'right',
                }]}
                actions={[{
                  icons: <AddCircleTwoToneIcon />,
                  handler: handleAddDialogOpen,
                  align: 'right',
                }]}
              
                order={order}
                orderBy={orderBy}
                onSort={handleSort}
                count={count}
                page={page}
                onChangePage={handleChangePage(refetch)}
                rowsPerPage={rowsPerPage}
                loader={loading}
                dataLength={count}
              />
              <AddOrderDialog
                open={addOpen}
                onClose={handleClose}
                onSubmit={onSubmitHandler(createOrder)}
                data={rowData}
              />
              <Cart
                open={open}
                onClose={handleCartClose}
              />
            </>
          )}
    </Mutation>
  );
}
export default Compose(withStyles(useStyles, { withTheme: true }),
  graphql(GET_ALL_PRODUCT, {
    options: { variables: { skip: 0, limit: 20, all: true } },
  }))(OrderList);

OrderList.propTypes = {
  classes: propTypes.objectOf(propTypes.any).isRequired,
};
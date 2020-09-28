import React, { useState, useEffect } from 'react';
import { graphql } from '@apollo/react-hoc';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import propTypes from 'prop-types';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';
import {
  AddProdDialog, EditProdDialog, RemoveProdDialog,
} from '../../components';
import { Mutation } from '@apollo/react-components';
import Compose from 'lodash.flowright';
import { TableComponent, SimpleTable } from '../../components';
import { GET_ALL_PRODUCT } from './query';
import { CREATE_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT } from './mutation';
import { UPDATE_PRODUCT_SUB, DELETE_PRODUCT_SUB } from './subscription';

const useStyles = {
  button: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
};

function ProductList(props) {
  const [ state, setState ] = useState({
    all: false,
    open: false,
    order: 'asc',
    orderBy: 'Date',
    page: 0,
    editOpen: false,
    removeOpen: false,
    rowData: {},
    rowsPerPage: 20,
  });

const handleClickOpen = () => {
  setState({ ...state, open: true });
}

const handleClose = async() => {
  await setState({...state, open: false, editOpen: false, removeOpen: false });
}

const handleOnSubmitDelete = (deleteProduct) => async(values) => {
  try{
    const { id } = values;
    const { page, rowsPerPage } = state;
    const {
      data: {
        getAllProduct: {
          count = 0,
        } = {},
      },
    } = props;
    const response = await deleteProduct({variables: { id }});
    if (count - page * rowsPerPage === 1 && page > 0) {
      setState({ page: page - 1 });
    }
    return { response };
  } catch (error) {
    return { error };
  }
}

async function handleSort(value) {
  const { orderBy, order } = state;
  const isAsc = orderBy === value && order === 'asc';
  const data = isAsc ? 'desc' : 'asc';
  setState({
    ...state,
    order: data,
    orderBy: value,
  });
}

async function handleEditDialogOpen(values) {
  setState({ ...state, editOpen: true, rowData: values });
}

async function handleRemoveDialogOpen(values) {
  setState({ ...state, removeOpen: true, rowData: values });
}

const handleChangePage = (refetch) => async(event, newPage) => {
  const { rowsPerPage, all } = state;
  refetch({ skip: newPage * rowsPerPage, limit: rowsPerPage, all });
  setState({ page: newPage });
}

const handleProductChange = async(event) => {
  const checked = event.target.checked;
  const { data: { refetch } } = props;
  const { page, rowsPerPage } = state;
  setState({
    ...state,
    all: checked,
  });
  if(checked) {
  await refetch({ skip: page * rowsPerPage, limit: rowsPerPage, all: true });
  }
  if(!checked) {
  await refetch({ skip: page * rowsPerPage, limit: rowsPerPage, all: false });
  }
}

const handleOnSubmitAdd = (createProduct) => async (values) => {
  try {
    const { name, price, description } = values;
    const response = await createProduct({ variables: { name, price, description } });
    return { response }
  } catch (error) {
    return { error };
  }
}

const handleOnSubmitEdit = (updateProduct) => async (values) => {
  try {
    const { name, price, description, id } = values;
    const response = await updateProduct({ variables: { name, price, description, id } });
    return { response };
  } catch (error) {
    return { error };
  }
}

useEffect(() => {
  const { page, rowsPerPage, all } = state;
  const { data: { getAllProduct: { count = 0 } = {}, subscribeToMore, refetch } } = props;
  subscribeToMore({
    document: UPDATE_PRODUCT_SUB,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData) return prev;
      if (subscriptionData) {
        return refetch({ skip: page, limit: rowsPerPage, all });
      }
    },
  });
  subscribeToMore({
    document: DELETE_PRODUCT_SUB,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData) return prev;
      if (subscriptionData) {
          if (count - page * rowsPerPage === 1 && page > 0) {
            setState({ page: page - 1 }, () => {
              const { page: updatePage } = state;
              return refetch({ skip: updatePage, limit: rowsPerPage, all });
          });
        }
        return refetch({ skip: page, limit: rowsPerPage, all });
      }
    },
  });
});

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
    open, order, orderBy, page, editOpen, rowData, removeOpen, all,
    rowsPerPage,
  } = state;
    const variables = { skip: page * rowsPerPage, limit: rowsPerPage, all };
  return (
    <Mutation
      mutation={DELETE_PRODUCT}
    >
      {(deleteProduct) => (
        <Mutation
        mutation={UPDATE_PRODUCT}
      >
        {(updateProduct) => (
          <Mutation
            mutation={CREATE_PRODUCT}
            refetchQueries={[{ query: GET_ALL_PRODUCT, variables }]}
          >
            {(createProduct) => (
            <>
              <div className={classes.button}>
              <FormGroup>
                <FormControlLabel
                  label={all ? 'own' : 'all'}
                  control={
                    <Switch onChange={handleProductChange} />
                  }
                />
              </FormGroup>
              </div>
              {!all && (
              <div className={classes.button}>
              <Tooltip title="Add" aria-label="add">
                  <Fab color="primary">
                    <AddIcon onClick={handleClickOpen}/>
                  </Fab>
                </Tooltip>
              </div>)}
              {!all && (      
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
                  icons: <EditIcon />,
                  handler: handleEditDialogOpen,
                  align: 'right',
                },
                {
                  icons: <DeleteIcon />,
                  handler: handleRemoveDialogOpen,
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
              />)}

              {all && (      
              <SimpleTable
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
              />)}

              <AddProdDialog
                open={open}
                onClose={handleClose}
                onSubmit={handleOnSubmitAdd(createProduct)}
              />

              <EditProdDialog
                open={editOpen}
                onSubmit={handleOnSubmitEdit(updateProduct)}
                onClose={handleClose}
                data={rowData}
              />
              <RemoveProdDialog
                open={removeOpen}
                onClose={handleClose}
                onSubmit={handleOnSubmitDelete(deleteProduct)}
                data={rowData}
              />
            </>
            )}
            </Mutation>
          )}
        </Mutation>
      )}
    </Mutation>
  );
}
export default Compose(withStyles(useStyles, { withTheme: true }),
  graphql(GET_ALL_PRODUCT, {
    options: { variables: { skip: 0, limit: 20, all: false } },
  }))(ProductList);

ProductList.propTypes = {
  classes: propTypes.objectOf(propTypes.any).isRequired,
};
import React, { useState, useEffect } from 'react';
import { graphql } from '@apollo/react-hoc';
import { withStyles } from '@material-ui/core/styles';
import propTypes from 'prop-types';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import {
  AddDialog, EditDialog, RemoveDialog,
} from '../../components';
import { Mutation } from '@apollo/react-components';
import Compose from 'lodash.flowright';
import { TableComponent } from '../../components';
import { GET_ALL_USER } from './query';
import { CREATE_USER, UPDATE_USER, DELETE_USER } from './mutation';
import { UPDATE_USER_SUB, DELETE_USER_SUB } from './subscription';

const useStyles = {
  button: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
};

const UserList = (props) => {
  const [ state, setState ] = useState({
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

const handleClose = () => {
  setState({...state, open: false, editOpen: false, removeOpen: false });
}

const handleOnSubmitDelete = (deleteUser) => async (values) => {
  try{
    const { id } = values;
    const { page, rowsPerPage } = state;
    const {
      data: {
        getAllUser: {
          count = 0,
        } = {},
        refetch,
      },
    } = props;
    const response = await deleteUser({variables: { id }});
    if (count - page * rowsPerPage === 1 && page > 0) {
      setState({ page: page - 1 }, () => {
        const { page: updatePage } = state;
        refetch({ skip: updatePage, limit: rowsPerPage });
      });
    }
    return { response };
  } catch (error) {
    return { error };
  }
}

useEffect(() => {
  const { page, rowsPerPage } = state;
  const { data: { getAllUser: { count = 0 } = {}, subscribeToMore, refetch } } = props;
  subscribeToMore({
    document: UPDATE_USER_SUB,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData) return prev;
      if (subscriptionData) {
        return refetch({ skip: page, limit: rowsPerPage });
      }
    },
  });
  subscribeToMore({
    document: DELETE_USER_SUB,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData) return prev;
      if (subscriptionData) {
          if (count - page * rowsPerPage === 1 && page > 0) {
            setState({ page: page - 1 }, () => {
              const { page: updatePage } = state;
              return refetch({ skip: updatePage, limit: rowsPerPage });
          });
        }
        return refetch({ skip: page, limit: rowsPerPage });
      }
    },
  });
});

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

const handleEditDialogOpen = async(values) => {
  setState({ ...state, editOpen: true, rowData: values });
}

const handleRemoveDialogOpen = (values) => {
  setState({ ...state, removeOpen: true, rowData: values });
}

const handleChangePage = (refetch) => async(event, newPage) => { 
  const { rowsPerPage } = state;
  refetch({ skip: newPage * rowsPerPage, limit: rowsPerPage });
  setState({ page: newPage });
}


const handleOnSubmitAdd = (createUser) => async (values) => {
  try {
    const { name, email, password, address, dob, role } = values;
    const data = { name, email, password, address, dob, role };
    const response = await createUser({ variables: { data } });
    return { response }
  } catch (error) {
    return { error };
  }
}

const handleOnSubmitEdit = (updateUser) => async (values) => {
  try {
    const { name, email, id } = values;
    const response = await updateUser({ variables: { id, name, email } });
    return { response };
  } catch (error) {
    return { error };
  }
}

const {
  data: {
    getAllUser: {
      records = [],
      count = 0,
    } = {},
    loading,
    refetch,
  },
  classes,
} = props;
  const {
    open, order, orderBy, page, editOpen, rowData, removeOpen,
    rowsPerPage,
  } = state;
    const variables = { skip: page * rowsPerPage, limit: rowsPerPage };
    return (
      <Mutation
        mutation={DELETE_USER}
      >
      {(deleteUser) => (
        <Mutation
          mutation={UPDATE_USER}
        >
          {(updateUser) => (
            <Mutation
              mutation={CREATE_USER}
              refetchQueries={[{ query: GET_ALL_USER, variables }]}
            >
              {(createUser) => (
                <>
                  <div className={classes.button}>
                    <Tooltip title="Add" aria-label="add">
                      <Fab color="primary">
                        <AddIcon onClick={handleClickOpen}/>
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
                      field: 'email',
                      label: 'Email-Address',
                      format: (value) => value && value.toUpperCase(),
                      align: 'center',
                    },
                    {
                      field: 'role',
                      label: 'Role',
                      align: 'center',
                    },
                    {
                      field: 'createdAt',
                      label: 'Date',
                      align: 'center',
                    }]}
                  
                    actions={[{
                      icons: <EditIcon />,
                      handler: handleEditDialogOpen,
                    },
                    {
                      icons: <DeleteIcon />,
                      handler: handleRemoveDialogOpen,
                    
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

                  <AddDialog
                    open={open}
                    onClose={handleClose}
                    onSubmit={handleOnSubmitAdd(createUser)}
                  />

                  <EditDialog
                    open={editOpen}
                    onSubmit={handleOnSubmitEdit(updateUser)}
                    onClose={handleClose}
                    data={rowData}
                  />
                  <RemoveDialog
                    open={removeOpen}
                    onClose={handleClose}
                    onSubmit={handleOnSubmitDelete(deleteUser)}
                    data={rowData}
                  />
                </>
                )}
                </Mutation>
              )}
            </Mutation>
          )}
        </Mutation>
    )
  }

UserList.propTypes = {
  classes: propTypes.objectOf(propTypes.any).isRequired,
};

export default Compose(withStyles(useStyles, { withTheme: true }),
  graphql(GET_ALL_USER, {
    options: { variables: { skip: 0, limit: 20 } },
  }))(UserList);
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Query } from '@apollo/react-components';
import { GET_MY_PROFILE } from './query';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';

export default class Home extends React.Component {
  render = () => {
    return (
      <Query query={GET_MY_PROFILE}>
      {({loading, data}) => {
        if (loading) {
          return (
            <Box paddingLeft={50}>
              <CircularProgress />
            </Box>
          );
        }
        if (data) return (
            <>
              <Route exact path="/home">
                <Redirect to={`/home/${data.getMyProfile.role}`} />
              </Route>
            </>
        );
      }}
    </Query>
    );
  };
}

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { NoMatch } from '../NoMatch';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import { Query } from '@apollo/react-components';
import { GET_MY_PROFILE } from './query';

const useStyles = makeStyles({
  root: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  cover: {
    width: 151,
  },
  wrapper: {
    textAlign: 'center',
  },
  button: {
    position: 'absolute',
    backgroundColor: 'lightGrey',
  },
});


const Me = (props) => {
    const classes = useStyles();
    return (
    <>  
      <Query query={GET_MY_PROFILE}>
        {({data, loading}) => {
          if(loading) {
            return (
              <Box paddingLeft={50}>
                <CircularProgress />
              </Box>
            )
          }
          if(data) {
            return  ( 
              Object.keys(data.getMyProfile).length
              ? (
                <Card className={classes.root}>
                  <div className={classes.details}>
                      <CardContent className={classes.content}>
                      <Typography component="h5" variant="h5">
                        Id - {data.getMyProfile.originalId}
                      </Typography>
                      <Typography component="h5" variant="h5">
                        Name - {data.getMyProfile.name}
                      </Typography>
                      <Typography variant="subtitle1">
                        Email - {data.getMyProfile.email}
                      </Typography>
                      <Typography variant="subtitle1">
                        Address - {data.getMyProfile.address}
                      </Typography>
                      <Typography variant="subtitle1">
                        Role - {data.getMyProfile.role}
                      </Typography>
                      <Typography variant="subtitle1">
                        Date of Birth - {data.getMyProfile.dob}
                      </Typography>
                      </CardContent>
                  </div>
                </Card>
              ) : <NoMatch />
            )
          }
        }}
      </Query>
    </>
    );
};
export default Me;

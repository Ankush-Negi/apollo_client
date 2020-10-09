import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
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
            const { getMyProfile: { originalId, name, email, address, role, dob } } = data;
            return  ( 
              <Card className={classes.root}>
                <div className={classes.details}>
                    <CardContent className={classes.content}>
                    <Typography component="h5" variant="h5">
                      Id - {originalId}
                    </Typography>
                    <Typography component="h5" variant="h5">
                      Name - {name}
                    </Typography>
                    <Typography variant="subtitle1">
                      Email - {email}
                    </Typography>
                    <Typography variant="subtitle1">
                      Address - {address}
                    </Typography>
                    <Typography variant="subtitle1">
                      Role - {role}
                    </Typography>
                    <Typography variant="subtitle1">
                      Date of Birth - {dob}
                    </Typography>
                    </CardContent>
                </div>
              </Card>
            )
          }
        }}
      </Query>
    </>
    );
};
export default Me;

import React from "react";
import axios from "axios";
import "react-nice-dates/build/style.css";
import "./styles.css";
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';


const GetStateDistrictDetails = () => {

    const [states, setStates] = React.useState([]);
    const [stateValue, setStateValue] = React.useState(1);
    const [districts, setDistricts] = React.useState([]);
    const [districtValue, setDistrictValue] = React.useState(1);
    const [loading, setLoading] = React.useState(true);

    const changeStateSelectHandler = (event) => {
        event.preventDefault();
        setStateValue(event.currentTarget.value);
    };

    const changeDistrictSelectHandler = (event) => {
        event.preventDefault();
        return(setDistrictValue(event.currentTarget.value));
    };

    React.useEffect(() => {
        async function getStates() {
            const response = await axios.get("https://cdn-api.co-vin.in/api/v2/admin/location/states");
            setStates(response.data.states.map(({ state_name, state_id }) => ({ label: state_name, value: state_id })));
            setLoading(false);
        }
        getStates();
    }, []);

    React.useEffect(() => {
      async function getDistricts(stateInput) {
        const response = await axios.get("https://cdn-api.co-vin.in/api/v2/admin/location/districts/" + stateInput);
        setDistricts(response.data.districts.map(({ district_name, district_id }) => ({ label: district_name, value: district_id })));

    };
    getDistricts(stateValue);
  }, []);

    

    const useStyles = makeStyles((theme) => ({
        formControl: {
          margin: theme.spacing(1),
          minWidth: 120,
        },
        selectEmpty: {
          marginTop: theme.spacing(2),
        }
      }));
    
      const classes = useStyles();

    return (
        <div>
            <FormControl variant="filled" className={classes.formControl}>
            <InputLabel htmlFor="filled-state-native-simple">States</InputLabel>
            <Select
                native
                value={stateValue}
                onChange={e => changeStateSelectHandler(e)}
                label="States"
                disabled={loading}
            >
                {states.map(({ label, value }) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </Select>
        </FormControl>
        <FormControl variant="filled" className={classes.formControl}>
        <InputLabel htmlFor="filled-district-native-simple">Districts</InputLabel>
        <Select
          native
          value={districtValue}
          onChange={changeDistrictSelectHandler}
          label="Districts"
          inputProps={{
            name: 'Districts',
            id: 'filled-district-native-simple',
          }}
        >

          {districts.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </FormControl>
        </div>
        

    );
}

export default GetStateDistrictDetails;
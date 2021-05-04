import React, { useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import { DatePicker } from "react-nice-dates";
import "./nice-date-styles.css";
import "./styles.css";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import FilledInput from '@material-ui/core/FilledInput';



function App() {
  const [vaccineCenters, setVaccineCenters] = useState(null);
  const [vaccineDates, setVaccineDates] = useState();
  const [pinCode, setPinCode] = useState("");
  const [selectSearch, setSelectSearch] = useState("isSearchByPincode")
  const [states, setStates] = React.useState([]);
  const [stateValue, setStateValue] = React.useState(1);
  const [districts, setDistricts] = React.useState([]);
  const [districtValue, setDistrictValue] = React.useState(1);
  const [loading, setLoading] = React.useState(true);

  const handleChange = (event) => {
    event.preventDefault();
    setSelectSearch(event.target.value);
  };

  const changeDistrictSelectHandler = (event) => {
    event.preventDefault();
    setDistrictValue(event.currentTarget.value);
  };

  const changeStateSelectHandler = (event) => {
    event.preventDefault();
    setStateValue(event.currentTarget.value);
    getDistricts(stateValue);
  };

  const fetchData = async () => {
    const formattedDate = format(vaccineDates, "dd-MM-yyyy");
    const formattedURL =
      "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/" + (selectSearch === "isSearchByPincode" ? "calendarByPin?pincode=" + pinCode : "calendarByDistrict?district_id=" + districtValue) + "&date=" +
      formattedDate;

    const response = await axios.get(formattedURL);

    setVaccineCenters(response.data.centers);
  };

  React.useEffect(() => {
    async function getStates() {
      const response = await axios.get("https://cdn-api.co-vin.in/api/v2/admin/location/states");
      setStates(response.data.states.map(({ state_name, state_id }) => ({ label: state_name, value: state_id })));
      setLoading(false);
    }
    getStates();
  }, []);



  const getDistricts = async (stateInput) => {
    const response = await axios.get("https://cdn-api.co-vin.in/api/v2/admin/location/districts/" + stateInput);
    setDistricts(response.data.districts.map(({ district_name, district_id }) => ({ label: district_name, value: district_id })));

  };


  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    '& > *': {
      margin: theme.spacing(1),
    }
  }));

  const classes = useStyles();

  return (
    <div className="App">
      <h1>Cowin Vaccine Slot Availablilty across India</h1>
      <FormControl component="fieldset">
        <FormLabel component="legend">Search by</FormLabel>
        <RadioGroup row aria-label="pincode" name="selectradio" value={selectSearch} onChange={handleChange}>
          <FormControlLabel value="isSearchByPincode" control={<Radio />} label="Pincode" checked={selectSearch === 'isSearchByPincode'} onClick={() => setSelectSearch('isSearchByPincode')} />
          <FormControlLabel value="isSearchByDistrict" control={<Radio />} label="District" checked={selectSearch === 'isSearchByDistrict'} onClick={() => setSelectSearch('isSearchByDistrict')} />
        </RadioGroup>
      </FormControl>
      {selectSearch === "isSearchByPincode" &&
        <div>
          <FormControl variant="filled">
            <InputLabel htmlFor="component-filled">Pincode</InputLabel>
            <FilledInput id="component-filled" placeholder="Enter Pincode" value={pinCode} onChange={e => setPinCode(e.target.value)} />
            <DatePicker
              date={vaccineDates}
              onDateChange={setVaccineDates}
              locale={enGB}
              format="dd-MM-yyyy"
            >
              {({ inputProps, focused }) => (
                <input
                  className={"input" + (focused ? " -focused" : "")}
                  {...inputProps}
                />
              )}
            </DatePicker>
          </FormControl>
          <p></p>
        </div>
      }

      {selectSearch === "isSearchByDistrict" &&
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
            <DatePicker
              date={vaccineDates}
              onDateChange={setVaccineDates}
              locale={enGB}
              format="dd-MM-yyyy"
            >
              {({ inputProps, focused }) => (
                <input
                  className={"input" + (focused ? " -focused" : "")}
                  {...inputProps}
                />
              )}
            </DatePicker>
          </FormControl>

        </div>
      }

      {/* Fetch data from API */}
      <div>
        <button className="fetch-button" onClick={fetchData}>
          Fetch Vaccine Centers
        </button>
        <br />
      </div>

      {/* Display data from API */}
      <div className="vaccines-detail">
        {vaccineCenters &&
          vaccineCenters.map((vaccineCenter, index) => {
            const cleanedDate = vaccineCenter.sessions[0].date;
            const mapLink = "https://www.google.com/maps/search/" + vaccineCenter.name + " " + vaccineCenter.pincode;

            return (
              <div className="vaccine-detail" key={index}>
                <h2>{vaccineCenter.name}</h2>
                <h3>{vaccineCenter.district_name}</h3>
                <h3>{vaccineCenter.block_name}</h3>

                <div className="details">
                  <p>
                    Available: {vaccineCenter.sessions[0].available_capacity}
                  </p>
                  <p>Minimum Age: {vaccineCenter.sessions[0].min_age_limit}</p>
                  <p>Pincode: {vaccineCenter.pincode}</p>
                  <p>Date: {cleanedDate}</p>
                  {
                    vaccineCenter.fee_type === "Paid" &&
                    vaccineCenter.vaccine_fees &&
                    <div>
                      <p>Vaccine Name: {vaccineCenter.vaccine_fees[0].vaccine}</p>
                      <p>Vaccine Price: <span>&#8377; </span> {vaccineCenter.vaccine_fees[0].fee}</p>
                    </div>
                  }
                  {vaccineCenter.fee_type === "Free" && !vaccineCenter.vaccine_fees &&
                    <div>
                      <p>Vaccine Name: {vaccineCenter.sessions[0].vaccine}</p>
                      <p>Vaccine Price: Free</p>
                    </div>
                  }
                  <p>Location: <a href={mapLink} target="blank">Look in Map</a></p>
                  <p>Registration Link: <a href="https://selfregistration.cowin.gov.in/" target="blank">Register Here</a></p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

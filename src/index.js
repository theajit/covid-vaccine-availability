import React, { useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import { DatePicker } from "react-nice-dates";
import "react-nice-dates/build/style.css";
import "./styles.css";

function App() {
  const [vaccineCenters, setVaccineCenters] = useState(null);
  const [vaccineDates, setVaccineDates] = useState();
  const [pinCode, setPinCode] = useState("");

  const fetchData = async () => {
    const formattedDate = format(vaccineDates, "dd-MM-yyyy");
    const formattedURL =
    "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=" + pinCode + "&date=" +
      formattedDate;
      
    const response = await axios.get(formattedURL);

    setVaccineCenters(response.data.centers);
  };

  return (
    <div className="App">
      <h1>BBMP Vaccine Slot Available Dates</h1>
      <div className="form-inline">
      <input
          className="effect-8"
           type="text"
           name="pincode"
           placeholder="Enter Pincode"
           value={pinCode}
           onChange={e => setPinCode(e.target.value)}
         />
      <DatePicker
        date={vaccineDates}
        onDateChange={setVaccineDates}
        locale={enGB}
        format="dd-MM-yyyy"
      >
        {({ inputProps, focused }) => (
          <input
            className={"effect-8 input" + (focused ? " -focused" : "")}
            {...inputProps}
          />
        )}
      </DatePicker>
      <p></p>
      </div>
      
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
                  <p>Price: {vaccineCenter.fee_type}</p>
                  {vaccineCenter.fee_type === "Paid" &&
                    <div>
                    <p>Vaccine Name: {vaccineCenter.vaccine_fees[0].vaccine}</p>
                    <p>Vaccine Price: <span>&#8377; </span>
                      {vaccineCenter.vaccine_fees[0].fee}</p>
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

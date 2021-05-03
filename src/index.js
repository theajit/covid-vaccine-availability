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

      <input
           type="text"
           name="pincode"
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
            className={"input" + (focused ? " -focused" : "")}
            {...inputProps}
          />
        )}
      </DatePicker>
      <p></p>
      {/* Fetch data from API */}
      <div>
        <button className="fetch-button" onClick={fetchData}>
          Fetch Available Dates
        </button>
        <br />
      </div>

      {/* Display data from API */}
      <div className="vaccines">
        {vaccineCenters &&
          vaccineCenters.map((vaccineCenter, index) => {
            const cleanedDate = vaccineCenter.sessions[0].date;
            const mapLink = "https://www.google.com/maps/search/" + vaccineCenter.name + " " + vaccineCenter.pincode;

            return (
              <div className="vaccine" key={index}>
                <h3>Vaccine Center {index + 1}</h3>
                <h2>{vaccineCenter.name}</h2>

                <div className="details">
                  <p>
                    Available: {vaccineCenter.sessions[0].available_capacity}
                  </p>
                  <p>Minimum Age: {vaccineCenter.sessions[0].min_age_limit}</p>
                  <p>Pincode: {vaccineCenter.pincode}</p>
                  <p>Date: {cleanedDate}</p>
                  <p>Location: <a href={mapLink} target="_blank">Look in Map</a></p>
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

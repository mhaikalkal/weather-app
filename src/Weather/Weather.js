import React, { useState } from "react";
import axios from "axios";
import "../index.css";

const WEATHER_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const url = `https://api.openweathermap.org/data/2.5/weather`;

const Weather = () => {
  const [city, setCity] = useState("");
  const [unit, setUnit] = useState("metric");

  const [searchedCityExist, setSearchedCityExist] = useState(true);

  const [cityWeather, setCityWeather] = useState([]);

  // fetch data. belum di oper ke state
  const getCityWeather = () => {
    return axios.get(`${url}?q=${city}&appid=${WEATHER_KEY}&units=${unit}`);
  };

  // Form Method
  const handleSubmit = (e) => {
    e.preventDefault();

    // kalau inputan ada valuenya / gak kosong, baru eksekusi fetch
    if (city) {
      getCityWeather()
        .then((response) => {
          setCityWeather([response.data]);
          console.log(response.data);
          setSearchedCityExist(true);
        })
        .catch((error) => {
          console.log(error);
          setSearchedCityExist(false);
        });
    }
  };

  const handleChange = (e) => {
    setCity(e.target.value);
  };

  return (
    <>
      <div className="top">
        <WeatherInput city={city} change={handleChange} submit={handleSubmit} />
      </div>

      <div className="main">
        {cityWeather.map((city) => {
          return <CityWeather key={city.sys.id} {...city} />;
        })}
      </div>
    </>
  );
};

const WeatherInput = (props) => {
  const { city, change, submit } = props;

  return (
    <div className="search">
      <form onSubmit={submit}>
        <input type="text" value={city} placeholder="Location" onChange={change} />
      </form>
    </div>
  );
};

const CityWeather = ({ main, name, weather }) => {
  return (
    <div className="weather">
      <h5>{name}</h5>
      <h1>{main.temp} °C</h1>
      <p>{weather[0].main}</p>
    </div>
  );
};

export default Weather;

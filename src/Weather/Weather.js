import React, { useState } from "react";
import axios from "axios";

const WEATHER_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const url = `https://api.openweathermap.org/data/2.5/weather`;

const Weather = () => {
  const [city, setCity] = useState("");
  const [unit, setUnit] = useState("metric");

  const [searchedCityExist, setSearchedCityExist] = useState(true);

  const [weatherList, setWeatherList] = useState([]);
  const [savedWeather, setSavedWeather] = useState([]);

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
          setWeatherList([response.data]);
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

  // Save City from Searched City
  const handleSave = (city) => {
    setSavedWeather([...savedWeather, city]);
  };

  // Remove City from Saved City
  const handleRemove = (city) => {
    // c == data city didalem useState.
    // city == data city yang diambil ketika click button remove
    let newSavedWeather = savedWeather.filter((c) => {
      return c.sys.id !== city.sys.id;
    });

    setSavedWeather(newSavedWeather);
  };

  return (
    <>
      <WeatherInput city={city} change={handleChange} submit={handleSubmit} />

      {searchedCityExist ? (
        <>
          {weatherList.map((city) => {
            return <ListedWeather key={city.sys.id} {...city} save={() => handleSave(city)} />;
          })}
        </>
      ) : (
        <>
          <h5>City Not Found</h5>
        </>
      )}

      {savedWeather.length > 0 ? <h1>Saved Cities</h1> : ""}
      {savedWeather.map((city) => {
        return <SavedWeather key={city.sys.id} {...city} remove={() => handleRemove(city)} />;
      })}
    </>
  );
};

const WeatherInput = (props) => {
  const { city, change, submit } = props;

  return (
    <form onSubmit={submit}>
      <input type="text" value={city} placeholder="City Name" onChange={change} />
      <button type="submit">Search</button>
    </form>
  );
};

const ListedWeather = ({ main, name, weather, save }) => {
  return (
    <div>
      <h2>{name}</h2>
      <p>{main.temp} C</p>
      <p>{weather[0].main}</p>
      <button type="submit" onClick={save}>
        Add to Watchlist
      </button>
    </div>
  );
};

const SavedWeather = ({ main, name, weather, remove }) => {
  return (
    <div>
      <h2>{name}</h2>
      <p>{main.temp} C</p>
      <p>{weather[0].main}</p>
      <button type="submit" onClick={remove}>
        Remove
      </button>
    </div>
  );
};

export default Weather;

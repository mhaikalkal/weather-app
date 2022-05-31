import React, { useState } from "react";
import axios from "axios";
import "../index.css";

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
    setWeatherList([]);
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

  // useEffect(() => {}, [savedWeather]);

  return (
    <>
      <div className="top">
        <WeatherInput city={city} change={handleChange} submit={handleSubmit} />
      </div>

      {searchedCityExist ? (
        <div className="search-result">
          {weatherList.map((city) => {
            return <ListedWeather key={city.sys.id} {...city} save={() => handleSave(city)} />;
          })}
        </div>
      ) : (
        <div className="search-result">
          <h5>City Not Found</h5>
        </div>
      )}

      <div className="saved">
        {savedWeather.map((city) => {
          return <SavedWeather key={city.sys.id} {...city} remove={() => handleRemove(city)} />;
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

const ListedWeather = ({ main, name, weather, save }) => {
  return (
    <div className="card">
      <h5>{name}</h5>
      <h3>{main.temp} °C</h3>
      <h6>{weather[0].main}</h6>
      <button type="submit" onClick={save}>
        Add to Watchlist
      </button>
    </div>
  );
};

const SavedWeather = ({ main, name, weather, remove }) => {
  return (
    <div className="saved-item">
      <h5>{name}</h5>
      <h1>{main.temp} °C</h1>
      <p>{weather[0].main}</p>
      <button type="submit" onClick={remove}>
        Remove
      </button>
    </div>
  );
};

export default Weather;

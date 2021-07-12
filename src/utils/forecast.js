const request = require("request");

const forecast = (latitude, longitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=e9104342d4f2547bb67f6aced5481612&query=${longitude},${latitude}&units=f`;

  request({ url, json: true }, (error, {body}) => {
    if (error) {
      callback("Unable to connect to weather services!", undefined);
    } else if (body.error) {
      callback("Unable to find location", undefined);
    } else {
      const { temperature, feelslike, humidity } = body.current;
      callback(
        undefined,
        `${body.current.weather_descriptions[0]}. It is currently ${temperature} degrees out. It feels like ${feelslike} degress out. The humidity - ${humidity}`
      );
    }
  });
};

module.exports = forecast;

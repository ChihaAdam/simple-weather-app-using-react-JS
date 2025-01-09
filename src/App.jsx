import Styles from './App.module.css'
import React ,{useState} from "react"
import axios from 'axios';
function App() {
  const apiKey="65a403cb03e25ddb8f96ecd86be7a2d2";
  const loading=[".","..","..."];
  const [load,setLoad]=useState("");
  const [error,setError]=useState("");
  const [city,setCity]=useState("");
  const [cityName,setCityName]=useState("");
  const [temp,setTemp]=useState("");
  const [humidity,setHumid]=useState("");
  const [weather,setWeather]=useState("");
  const handleCityChange = (event)=>{
    setCity(event.target.value);
  }
  function KtoC(k){
    return `${(k-273.15).toFixed(1)} °C`;
  }
  async function info(){
    let l;
    let i=0;
    const loadingInterval = setInterval(()=>{
        l="loading"+loading[i%3];
        setLoad(l);
        i++;
    },200);
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
      if (response.status>=200 && response.status<=299){
        let data = response.data;
        const info = data.main;
        const weath=data.weather;
        setCityName(city +'-' + data.sys.country);
        setTemp(`temperature ${KtoC(info.temp)}`); 
        setHumid(`humidity : ${info.humidity} %`);
        setWeather(`https://openweathermap.org/img/wn/${weath[0].icon}@2x.png`);
      }
    } catch (error) {
      setError(`error: ${error.response?.data?.message || error.message}`)
    }
    finally{
      if (loadingInterval){
        clearInterval(loadingInterval);
      }
      setLoad("");
    }
  }
  function testing(){
    if (city=="") return;
    let a;
    for(let i=0;i<city.length;i++){
      a=city[i].charCodeAt();
      if (a=" ") continue;
      if (a<65) {
        setError("please add a valid name");
        return;
      }
      if (a>122) {
        setError("please add a valid name");
        return;
      }
      if (a>90 && a<97) {
        setError("please add a valid name");
        return;
      }
    }
    let aux = city;
    aux = aux[0].toUpperCase()+aux.slice(1,aux.length).toLowerCase();
    setCity(aux);
    setError("");
    info();
  }
  function handleByEnter(event){
    if (event.key=="Enter"){
      testing();
    }
  }
  return (<div className={Styles.container}>
              <div className={Styles.searchBox}>
              <h1 className={Styles.title}>weather app</h1>
              <input className={Styles.cityInput} type="text" onKeyUp={handleByEnter} onChange={handleCityChange} placeholder="enter a city"></input>
              <button className={Styles.button} onClick={testing}>🔍</button>
              <br /><br />
              <span className={Styles.loading}>{load}</span>
              <span className={Styles.error}>{error}</span>
              </div>
              <div className={Styles.Info}>
                   <h1>{cityName}</h1> 
                   <h2>{temp}</h2> 
                   <h2>{humidity}</h2>
                   <img src={weather} className={Styles.icon} />       
              </div>
          </div>)
}
export default App

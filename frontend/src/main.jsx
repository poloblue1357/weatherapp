import { createRoot } from 'react-dom/client';
import './index.css';  
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import React from "react"


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)


// how to write component in vue
// <script>
// import WeatherCard from './WeatherCard.vue'
// const cards = [
//     { color: "blue", icon: 'water', label:"Humidity", content:"42", units: "%"},
//     { color: "grey", icon: 'wind', label:"Direction", content:"NNE", units: ""},
// ]
// </script>
// <template>
//     <div class="cards">
//         <WeatherCard v-for="card in cards" :color="card.color" :>
//         </WeatherCard>
//     </div>
//     <div v-if="activeTab === 'current'" className="mb-4">
//         <WeatherCard
//             isFavorite="isFavorite"
//             onToggleFavorite="toggleFavorite"
//         />
//     </div>
//     <Forecast v-else forecastInfo={currentForecast} />
// </template>
// <style>
// .cards {
//     margin-bottom: 4px;
// }
// .a {
//     background: rgba(10, 132, 255, 0.15); border: 1px solid rgba(10, 132, 255, 0.25); border-radius: 12px; padding: 12px;
// }
// .b {
//     font-size: 11px; color: rgba(235, 235, 245, 0.8); margin-bottom: 4px;
// }
// .c {
//     font-size: 20px; font-weight: 700; color: rgb(100, 210, 255);
// }
// .d {
// font-size: 13px; font-weight: 400;
// }
// </style>

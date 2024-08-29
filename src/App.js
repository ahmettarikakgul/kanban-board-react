import "./App.css";
import Home from "./home/Home";
import Details from "./containers/details/Details";
import { Routes, Route, useLocation } from "react-router-dom";

function App() {
  const location=useLocation()
  const background=location.state && location.state.previousLocation
  // console.log(background)
  return (
    <div className="App">
      <Routes location={background || location} >
        <Route path={"/"} element={<Home />}/>
        </Routes>
      
      {background && (
        <Routes>
        <Route path={"/:boardId/:cardId/:cardTitle"} element={<Details />} />   
        </Routes>
        )}
    </div>
  );
}

export default App;

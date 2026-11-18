import { useEffect, useState } from 'react'
import {
  BrowserRouter as Router, Route, Routes
} from "react-router-dom";
import './App.css'
import Home from './Components/Home';
import Error from './Components/Error';
import Filter from './Components/Filter';
import Graph from './Components/Graph';
import Notes from './Components/Notes';
import Text from './Components/Text';

function App() {
return(
  <div className='main'>
    <Router >
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='datapick' element={<Filter/>}/>
          <Route path='graphbrowser' element={<Graph/>}/>
          <Route path='notesbrowser' element={<Notes/>}/>
          <Route path='mdbrowser' element={<Text/>}/>
          <Route path='*' element={<Error/>}/>
      </Routes>
    </Router> 
  </div>
)


}

export default App

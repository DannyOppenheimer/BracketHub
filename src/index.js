import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  Navigation,
  Home,
  CreateBracket,
  JoinBracketGroup,
  MyBracketGroups,
  Explore,
} from "./components";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Navigation />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/bracket-builder" element={<CreateBracket />} />
      <Route path="/join-bracket" element={<JoinBracketGroup />} />
      <Route path="/bracket-groups" element={<MyBracketGroups />} />
      <Route path="/explore" element={<Explore />} />
    </Routes>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

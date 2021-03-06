import './App.css';
import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { Provider } from "react-redux";
import store from "./store";

const App = () => (
  <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar />
        <Routes>
          <Route index path="/" element={<Landing />} />
        </Routes>
        <section className="container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
          </section>
      </Fragment>
    </Router>
  </Provider>
);

export default App;

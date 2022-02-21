import React, { Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { connect } from "react-redux";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Create from "./pages/Quiz/Create";
import QuizData from "./pages/Quiz/QuizData";
import UpdateQuizData from "./pages/Quiz/UpdateQuizData";

function App(props) {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Quiz */}
        <Route path="/" element={<Home />}></Route>
        <Route path="/create" element={<Create />}></Route>
        <Route path={`/quiz/:id`} exact element={<QuizData />}></Route>
        <Route path={`/quiz/update/:id`} exact element={<UpdateQuizData />}></Route>
      </Routes>
    </>
  );
}

export default connect((state) => state, {})(App);

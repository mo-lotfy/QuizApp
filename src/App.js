import React, { Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { connect } from "react-redux";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Create from "./pages/Quiz/Create";
import QuizData from "./pages/Quiz/QuizData";
import UpdateQuizData from "./pages/Quiz/UpdateQuizData";
import QuizQuestions from "./pages/Quiz/QuizQuestions";

import CreateQuestion from "./pages/Questions/Create";
import UpdateQuestion from "./pages/Questions/Update";

import CreateAnswer from "./pages/Answers/Create";
import UpdateAnswer from "./pages/Answers/Update";

function App(props) {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Quiz */}
        <Route path="/" element={<Home />}></Route>
        <Route path="/create" element={<Create />}></Route>
        <Route path={`/quiz/:id`} exact element={<QuizData />}></Route>
        <Route path={`/quiz/:id/update`} exact element={<UpdateQuizData />}></Route>
        <Route path={`/quiz/:id/questions/create`} exact element={<CreateQuestion />}></Route>

        {/* Exam */}
        <Route path={`/quiz/:id/questions`} exact element={<QuizQuestions />}></Route>

        {/* Questions */}
        <Route path={`/quiz/:id/question/:qid`} exact element={<QuizQuestions />}></Route>
        <Route path={`/quiz/:id/question/:qid/update`} exact element={<UpdateQuestion />}></Route>

        {/* Answers */}
        {/* <Route path={`/quiz/:id/question/:qid/answers`} exact element={<QuizQuestions />}></Route> */}
        <Route path={`/quiz/:id/question/:qid/answer/create`} exact element={<CreateAnswer />}></Route>
        <Route path={`/quiz/:id/question/:qid/answer/update/:aid`} exact element={<UpdateAnswer />}></Route>

      </Routes>
    </>
  );
}

export default connect((state) => state, {})(App);

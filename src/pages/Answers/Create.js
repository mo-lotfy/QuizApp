import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Container, Breadcrumb, BreadcrumbItem, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { createQuiz } from "../../redux/config";

function gen() {
  return Math.random().toString(16).slice(-4);
}

function simpleUniqueId() {
  return [gen(), gen(), gen()].join("");
}

function CreateAnswer(props) {
  const {
    quiz: { quizzes },
    createQuiz,
  } = props;
  const [title, setTitle] = useState("");
  const [isTrue, setTrue] = useState(false);
  const navigate = useNavigate();

  let params = useParams();
  const QuizInfo = quizzes?.find((q) => q?.id === params?.id);

  const QuestionInfo = QuizInfo?.questions?.find((q) => q?.id === params?.qid);
  let otherAnswers = QuestionInfo?.answers || [];

  const onSubmit = (e) => {
    e.preventDefault();

    if (isTrue) {
      // Convere other answers to false
      otherAnswers = otherAnswers.map((a) => {
        return { ...a, isTrue: false };
      });
    }

    createQuiz([
      ...quizzes.filter((quiz) => quiz?.id !== QuizInfo?.id),
      {
        ...QuizInfo,
        questions: [
          ...QuizInfo.questions.filter((question) => question?.id !== params?.qid),
          {
            ...QuestionInfo,
            answers: [{ id: simpleUniqueId(), title, isTrue }, ...otherAnswers],
          },
        ],
      },
    ]);
    navigate(`/quiz/${QuizInfo.id}`);
  };
  return (
    <>
      <Container>
        <Form onSubmit={(e) => onSubmit(e)}>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to={`/quiz/${QuizInfo.id}`}>{QuizInfo?.title}</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>Create Answer</BreadcrumbItem>
          </Breadcrumb>
          <h1 className="border-bottom pb-2 mt-4">Create Answer</h1>
          <FormGroup>
            <Label for="title">Answer Title</Label>
            <Input id="title" name="title" required placeholder="Write answer title" type="text" onChange={(e) => setTitle(e.target.value)} value={title} />
          </FormGroup>
          <FormGroup check>
            <Input id="is_true" type="checkbox" onChange={(e) => setTrue(!isTrue)} value={isTrue} /> <Label check>Is True</Label>
          </FormGroup>
          <Button>Create</Button>
        </Form>
      </Container>
    </>
  );
}

export default connect((state) => state, { createQuiz })(CreateAnswer);

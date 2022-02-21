import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Container, Breadcrumb, BreadcrumbItem, Card, CardBody, CardSubtitle, CardTitle, CardText, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { createQuiz } from "../../redux/config";

function gen() {
  return Math.random().toString(16).slice(-4);
}

function simpleUniqueId() {
  return [gen(), gen(), gen()].join("");
}

function UpdateQuestion(props) {
  const {
    quiz: { quizzes },
    createQuiz,
  } = props;
  let params = useParams();
  const navigate = useNavigate();

  const QuizInfo = quizzes?.find((q) => q?.id === params?.id);
  const QuestionInfo = QuizInfo?.questions?.find((q) => q?.id === params?.qid);
  const AnswerInfo = QuestionInfo?.answers?.find((q) => q?.id === params?.aid);

  const [title, setTitle] = useState(AnswerInfo?.title);
  const [isTrue, setTrue] = useState(AnswerInfo?.isTrue);

  let otherAnswers = QuestionInfo?.answers?.filter((answer) => answer?.id !== params?.aid);

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
          ...QuizInfo.questions?.filter((question) => question?.id !== params?.qid),
          {
            ...QuizInfo.questions?.find((question) => question?.id === params?.qid),
            answers: [{ ...AnswerInfo, title, isTrue }, ...otherAnswers],
          },
        ],
      },
    ]);
    navigate(`/quiz/${QuizInfo.id}`);
  };
  return (
    <>
      <Container>
        {(() => {
          if (QuizInfo === undefined) {
            return (
              <Card className="mt-5">
                <CardBody>
                  <CardText>Quiz doesn't exist</CardText>

                  <Button className="ml-2 d-inline" size="sm" to="/" tag={Link}>
                    Discover Quizzes
                  </Button>
                </CardBody>
              </Card>
            );
          } else if (QuestionInfo === undefined) {
            return (
              <Card className="mt-5">
                <CardBody>
                  <CardText>Question doesn't exist</CardText>

                  <Button className="ml-2 d-inline" size="sm" to={`/quiz/${QuizInfo?.id}`} tag={Link}>
                    Discover Quiz Questions
                  </Button>
                </CardBody>
              </Card>
            );
          } else if (AnswerInfo === undefined) {
            return (
              <Card className="mt-5">
                <CardBody>
                  <CardText>Question doesn't exist</CardText>

                  <Button className="ml-2 d-inline" size="sm" to={`/quiz/${QuizInfo?.id}`} tag={Link}>
                    Discover Quiz Questions
                  </Button>
                </CardBody>
              </Card>
            );
          } else {
            return (
              <>
                <Breadcrumb>
                  <BreadcrumbItem>
                    <Link to="/">Quiz</Link>
                  </BreadcrumbItem>
                  <BreadcrumbItem active>Update {QuestionInfo?.title}</BreadcrumbItem>
                </Breadcrumb>
                <h1 className="border-bottom pb-2 d-flex justify-content-between align-items-center">Update: {QuestionInfo?.title}</h1>
                <Form onSubmit={(e) => onSubmit(e)}>
                  <FormGroup>
                    <Label for="title">Answer Title</Label>
                    <Input id="title" name="title" required placeholder="Write answer title" type="text" onChange={(e) => setTitle(e.target.value)} value={title} />
                  </FormGroup>
                  <FormGroup>
                    <Input id="is_true" checked={isTrue} type="checkbox" onChange={(e) => setTrue(!isTrue)} /> <Label check>Is True</Label>
                  </FormGroup>
                  <Button>Update</Button>
                </Form>
              </>
            );
          }
        })()}
      </Container>
    </>
  );
}

export default connect((state) => state, { createQuiz })(UpdateQuestion);

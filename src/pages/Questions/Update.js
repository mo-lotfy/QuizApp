import React, { useState } from "react";
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

  const QuizInfo = quizzes?.find((q) => q?.id === params?.id);
  const QuestionInfo = QuizInfo?.questions?.find((q) => q?.id === params?.qid);

  const [title, setTitle] = useState(QuestionInfo?.title);
  const [successFeedback, setSuccessFeedback] = useState(QuestionInfo?.successFeedback);
  const [failureFeedback, setFailureFeedback] = useState(QuestionInfo?.failureFeedback);
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    createQuiz([
      ...quizzes?.filter((quiz) => quiz?.id !== QuizInfo?.id),
      {
        ...QuizInfo,
        questions: [
          ...QuizInfo.questions?.filter((question) => question?.id !== params?.qid),
          {
            ...QuizInfo?.questions?.find((q) => q?.id === params?.qid),
            title,
            successFeedback,
            failureFeedback,
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
                    <Label for="title">Questions Title</Label>
                    <Input id="title" name="title" required placeholder="Write question title" type="text" onChange={(e) => setTitle(e.target.value)} value={title} />
                  </FormGroup>
                  <FormGroup>
                    <Label for="description">Success Feedback</Label>
                    <Input id="description" name="description" required placeholder="Write question description" type="text" onChange={(e) => setSuccessFeedback(e.target.value)} value={successFeedback} />
                  </FormGroup>
                  <FormGroup>
                    <Label for="description">Failure Feedback</Label>
                    <Input id="description" name="description" required placeholder="Write question description" type="text" onChange={(e) => setFailureFeedback(e.target.value)} value={failureFeedback} />
                  </FormGroup>
                  <Button>Update</Button>
                  {(() => {
                    if (QuizInfo?.created?.toLocaleDateString() !== QuizInfo?.modified?.toLocaleDateString()) {
                      return <small className="text-muted d-block mt-3">Modified at: {QuizInfo?.modified?.toLocaleDateString()}</small>;
                    }
                  })()}
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

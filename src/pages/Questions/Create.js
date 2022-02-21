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

function CreateQuestion(props) {
  const {
    quiz: { quizzes },
    createQuiz,
  } = props;
  const [title, setTitle] = useState("");
  const [successFeedback, setSuccessFeedback] = useState("");
  const [failureFeedback, setFailureFeedback] = useState("");
  const navigate = useNavigate();

  let params = useParams();
  const QuizInfo = quizzes?.find((q) => q?.id === params?.id);

  const onSubmit = (e) => {
    e.preventDefault();
    createQuiz([
      ...quizzes.filter((quiz) => quiz?.id !== QuizInfo?.id),
      {
        ...QuizInfo,
        questions: [
          ...QuizInfo.questions,
          {
            id: simpleUniqueId(),
            title,
            successFeedback,
            failureFeedback,
            answers:[],
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
            <BreadcrumbItem active>Create Question</BreadcrumbItem>
          </Breadcrumb>
          <h1 className="border-bottom pb-2 mt-4">Create Questions</h1>
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
          <Button>Create</Button>
        </Form>
      </Container>
    </>
  );
}

export default connect((state) => state, { createQuiz })(CreateQuestion);

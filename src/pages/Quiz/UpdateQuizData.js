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

function UpdateQuizData(props) {
  const {
    quiz: { quizzes },
    createQuiz,
  } = props;
  let params = useParams();

  const QuizInfo = quizzes?.find((q) => q?.id === params?.id);
  const [title, setTitle] = useState(QuizInfo?.title);
  const [desc, setDesc] = useState(QuizInfo?.desc);
  const [url, setUrl] = useState(QuizInfo?.url);
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    createQuiz([
      ...quizzes.filter((quiz) => quiz?.id !== QuizInfo?.id),
      {
        ...QuizInfo,
        title,
        desc,
        url,
        modified: new Date(),
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
                  <CardText>Quiz doesn't exists</CardText>

                  <Button className="ml-2 d-inline" size="sm" to="/" tag={Link}>
                    Discover Quizzes
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
                  <BreadcrumbItem active>Update {QuizInfo?.title}</BreadcrumbItem>
                </Breadcrumb>
                <small className="text-muted d-block">Created at: {QuizInfo?.created?.toLocaleDateString()}</small>
                <h1 className="border-bottom pb-2 d-flex justify-content-between align-items-center">Update: {QuizInfo?.title}</h1>
                <Form onSubmit={(e) => onSubmit(e)}>
                  <FormGroup>
                    <Label for="title">Quiz Title</Label>
                    <Input id="title" name="title" required placeholder="Write quiz title" type="text" onChange={(e) => setTitle(e.target.value)} value={title} />
                  </FormGroup>
                  <FormGroup>
                    <Label for="description">Quiz Description</Label>
                    <Input id="description" name="description" required placeholder="Write quiz description" type="text" onChange={(e) => setDesc(e.target.value)} value={desc} />
                  </FormGroup>
                  <FormGroup>
                    <Label for="url">Quiz URL</Label>
                    <Input id="url" name="url" placeholder="Write quiz URL" type="text" onChange={(e) => setUrl(e.target.value)} value={url} />
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

export default connect((state) => state, { createQuiz })(UpdateQuizData);

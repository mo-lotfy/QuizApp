import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Container, Breadcrumb, BreadcrumbItem, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { createQuiz } from "../../redux/config";

function gen() {
  return Math.random().toString(16).slice(-4);
}

function simpleUniqueId() {
  return [gen(), gen(), gen()].join("");
}

function Create(props) {
  const {
    quiz: { quizzes },
    createQuiz,
  } = props;
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [url, setUrl] = useState("");
  const navigate = useNavigate();
  const onSubmit = (e) => {
    e.preventDefault();
    createQuiz([
      ...quizzes,
      {
        id: simpleUniqueId(),
        title,
        desc,
        url,
        questions: [],
        created: new Date(),
        modified: new Date(),
        score: null,
      },
    ]);
    navigate("/");
  };
  return (
    <>
      <Container>
        <Form onSubmit={(e) => onSubmit(e)}>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/">Quiz</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>Create</BreadcrumbItem>
          </Breadcrumb>
          <h1 className="border-bottom pb-2 mt-4">Create Quiz</h1>
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
          <Button>Create</Button>
        </Form>
      </Container>
    </>
  );
}

export default connect((state) => state, { createQuiz })(Create);

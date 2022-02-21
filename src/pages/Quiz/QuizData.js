import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Container, Breadcrumb, BreadcrumbItem, Card, CardBody, CardSubtitle, CardTitle, CardText, Button } from "reactstrap";
import { createQuiz } from "../../redux/config";

function gen() {
  return Math.random().toString(16).slice(-4);
}

function simpleUniqueId() {
  return [gen(), gen(), gen()].join("");
}

function QuizData(props) {
  const {
    quiz: { quizzes },
    createQuiz,
  } = props;

  let params = useParams();
  const navigate = useNavigate();
  const QuizInfo = quizzes?.find((q) => q?.id === params?.id);
  const deleteQuiz = async (e) => {
    await createQuiz([...quizzes.filter((quiz) => quiz?.id !== QuizInfo?.id)]);
    await navigate("/");
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
                  <BreadcrumbItem active>{QuizInfo?.title}</BreadcrumbItem>
                </Breadcrumb>
                <h1 className="border-bottom pb-2 mt-4 d-flex justify-content-between align-items-center">
                  {QuizInfo?.title}
                  <span>
                    <Button to={`/quiz/update/${QuizInfo?.id}`} tag={Link} color="light">
                      Update
                    </Button>
                    <Button
                      color="danger"
                      onClick={(e) => {
                        deleteQuiz(QuizInfo?.id);
                      }}
                    >
                      Delete
                    </Button>
                  </span>
                </h1>
                <Card>
                  <CardBody>
                    <CardText>{QuizInfo?.desc}</CardText>
                    {(() => {
                      if (QuizInfo?.url) {
                        return (
                          <CardSubtitle tag="a" href={QuizInfo?.url}>
                            {QuizInfo?.url}
                          </CardSubtitle>
                        );
                      }
                    })()}
                    <CardText>
                      <small className="text-muted d-block mt-4">Created at: {QuizInfo?.created?.toLocaleDateString()}</small>
                      {(() => {
                        if (QuizInfo?.created?.toLocaleDateString() !== QuizInfo?.modified?.toLocaleDateString()) {
                          return <small className="text-muted d-block">Modified at: {QuizInfo?.modified?.toLocaleDateString()}</small>;
                        }
                      })()}
                    </CardText>
                  </CardBody>
                </Card>
              </>
            );
          }
        })()}
      </Container>
    </>
  );
}

export default connect((state) => state, { createQuiz })(QuizData);

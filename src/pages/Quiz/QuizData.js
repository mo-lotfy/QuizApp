import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Container, Breadcrumb, BreadcrumbItem, Card, CardBody, CardSubtitle, CardTitle, CardText, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Row, CardDeck, Col, ListGroup, ListGroupItem } from "reactstrap";
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

  const deleteQuiz = (e) => {
    createQuiz([...quizzes.filter((quiz) => quiz?.id !== QuizInfo?.id)]);
    navigate("/");
  };

  const deleteQuestion = ({ qid }) => {
    console.log(QuizInfo?.questions?.filter((q) => q?.id !== qid));
    createQuiz([
      ...quizzes?.filter((quiz) => quiz?.id !== QuizInfo?.id),
      {
        ...QuizInfo,
        questions: [...QuizInfo?.questions?.filter((q) => q?.id !== qid)],
      },
    ]);
  };

  const deleteAnswer = async ({ qid, aid }) => {
    let QuestionInfo = QuizInfo?.questions?.find((q) => q?.id === qid);
    let AnswerInfo = QuestionInfo?.answers?.find((q) => q?.id === aid);
    let otherAnswers = QuestionInfo?.answers?.filter((answer) => answer?.id !== aid);

    createQuiz([
      ...quizzes.filter((quiz) => quiz?.id !== QuizInfo?.id),
      {
        ...QuizInfo,
        questions: [
          ...QuizInfo?.questions?.filter((question) => question?.id !== qid),
          {
            ...QuestionInfo,
            answers: [...otherAnswers],
          },
        ],
      },
    ]);
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
                  <UncontrolledButtonDropdown color="light">
                    <DropdownToggle caret>Controll</DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem to={`/quiz/${QuizInfo?.id}/update`} tag={Link}>
                        Update Quiz
                      </DropdownItem>
                      <DropdownItem
                        className="text-danger"
                        onClick={(e) => {
                          deleteQuiz(QuizInfo?.id);
                        }}
                      >
                        Delete Quiz
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledButtonDropdown>
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
                <h1 className="border-bottom pb-2 mt-4 d-flex justify-content-between align-items-center">
                  {QuizInfo?.title} Questions
                  <Button color="light" to={`/quiz/${QuizInfo?.id}/questions/create`} tag={Link}>
                    Create Question
                  </Button>
                </h1>
                <CardDeck className="d-flex flex-row">
                  {(() => {
                    if (QuizInfo?.questions?.length === 0) {
                      return (
                        <div className="d-inline-flex align-items-baseline justify-content-between">
                          <p>Create you first Question</p>
                        </div>
                      );
                    } else {
                      return QuizInfo?.questions?.map((question) => (
                        <Card tag={Col} md="4" className="mb-3" key={question?.id}>
                          <CardBody className="d-flex align-items-center justify-content-between">
                            <CardTitle tag="h4">{question?.title}</CardTitle>
                            <UncontrolledButtonDropdown color="light">
                              <DropdownToggle caret>Controll</DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem to={`/quiz/${QuizInfo?.id}/question/${question?.id}/answer/create`} tag={Link}>
                                  Create Answer
                                </DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem to={`/quiz/${QuizInfo?.id}/question/${question?.id}/update`} tag={Link}>
                                  Update Question
                                </DropdownItem>
                                <DropdownItem
                                  className="text-danger"
                                  onClick={(e) => {
                                    deleteQuestion({ id: QuizInfo?.id, qid: question?.id });
                                  }}
                                >
                                  Delete Question
                                </DropdownItem>
                              </DropdownMenu>
                            </UncontrolledButtonDropdown>
                          </CardBody>
                          <CardBody className="d-flex align-items-center justify-content-between">
                            <ListGroup flush numbered className="w-100">
                              {(() => {
                                if (question?.answers?.length === 0) {
                                  return (
                                    <div className="d-inline-flex align-items-baseline justify-content-between">
                                      <p>Create you first Answer</p>
                                      <Button className="ml-2 d-inline" color="success" size="sm" to={`/quiz/${QuizInfo?.id}/question/${question?.id}/answer/create`} tag={Link}>
                                        Create Answer
                                      </Button>
                                    </div>
                                  );
                                } else {
                                  return question?.answers?.map((answer) => (
                                      <ListGroupItem className={` w-100 px-0 ${answer?.isTrue === true ? "text-success" : ""}`} key={answer?.id}>
                                        {answer?.title}
                                        <UncontrolledButtonDropdown color="light" className=" float-end">
                                          <DropdownToggle caret>Controll</DropdownToggle>
                                          <DropdownMenu>
                                            <DropdownItem to={`/quiz/${QuizInfo?.id}/question/${question?.id}/answer/update/${answer?.id}`} tag={Link}>
                                              Update Answer
                                            </DropdownItem>
                                            <DropdownItem divider />
                                            <DropdownItem
                                              className="text-danger"
                                              onClick={(e) => {
                                                deleteAnswer({ qid: question?.id, aid: answer?.id });
                                              }}
                                            >
                                              Delete Answer
                                            </DropdownItem>
                                          </DropdownMenu>
                                        </UncontrolledButtonDropdown>
                                      </ListGroupItem>
                                    ));
                                }
                              })()}
                            </ListGroup>
                          </CardBody>
                        </Card>
                      ));
                    }
                  })()}
                </CardDeck>
              </>
            );
          }
        })()}
      </Container>
    </>
  );
}

export default connect((state) => state, { createQuiz })(QuizData);

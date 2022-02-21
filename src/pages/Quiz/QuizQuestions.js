import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Container, Breadcrumb, BreadcrumbItem, Card, CardBody, CardSubtitle, CardTitle, CardText, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Col, ListGroup, ListGroupItem, Progress, ButtonGroup, Badge } from "reactstrap";
import { createQuiz } from "../../redux/config";

function QuizQuestions(props) {
  const {
    quiz: { quizzes },
    createQuiz,
  } = props;
  const navigate = useNavigate();
  let params = useParams();
  const QuizInfo = quizzes?.find((q) => q?.id === params?.id);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [finishedQuestions, setFinishedQuestions] = useState([]);
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setFinished] = useState(false);

  useEffect(() => {
    if (QuizInfo?.questions?.length !== 0) {
      setCurrentQuestion(QuizInfo?.questions[0]);
    }
  }, [QuizInfo]);

  useEffect(() => {
    setProgress((finishedQuestions?.length * 100) / QuizInfo?.questions?.length);
    setScore((finishedQuestions?.filter((q) => q?.isSuccess === true)?.length * 100) / QuizInfo?.questions?.length);
  }, [finishedQuestions]);

  useEffect(() => {
    if (isFinished) {
      setTimeout(() => {
        createQuiz([
          ...quizzes.filter((quiz) => quiz?.id !== QuizInfo?.id),
          {
            ...QuizInfo,
            score: (finishedQuestions?.filter((q) => q?.isSuccess === true)?.length * 100) / QuizInfo?.questions?.length,
          },
        ]);
        navigate(`/`);
      }, 500);
    }
  }, [isFinished]);

  const nextQuestion = ({ currentQuestion, currentAnswer }) => {
    setFinishedQuestions([...finishedQuestions, { ...currentQuestion, ...(currentAnswer?.isTrue && { isSuccess: true, feedback: currentQuestion?.successFeedback }), ...(!currentAnswer?.isTrue && { isSuccess: false, feedback: currentQuestion?.failureFeedback }) }]);
    let otherQuestions = QuizInfo?.questions?.filter((q) => ![currentQuestion?.id, ...finishedQuestions?.map((qu) => qu?.id)].includes(q?.id));
    if (otherQuestions?.length !== 0) {
      setCurrentQuestion(otherQuestions[0]);
    } else {
      // Quiz Finished
      setCurrentQuestion(null);
      setFinished(true);
    }
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
                <h1 className="border-bottom pb-2 mt-4 d-flex justify-content-between align-items-center">{QuizInfo?.title}</h1>
                {(() => {
                  if (QuizInfo?.questions?.length !== 0) {
                    return (
                      <>
                        <Progress animated color="primary" striped value={progress} />
                        <Progress animated color="success" striped value={score} />
                      </>
                    );
                  }
                })()}

                {(() => {
                  if (QuizInfo?.questions?.length === 0) {
                    return (
                      <div className="d-inline-flex align-items-baseline justify-content-between">
                        <p>Create you first Question</p>
                        <Button className="ml-2 d-inline" size="sm" to={`/quiz/${QuizInfo?.id}/questions/create`} tag={Link}>
                          Create Question
                        </Button>
                      </div>
                    );
                  } else if (finishedQuestions?.length === 0) {
                    return (
                      <Card tag={Col} md="6" className="mb-3 w-100">
                        <CardBody>
                          <CardTitle tag="h4" className="text-center mb-0">
                            Start Quiz
                          </CardTitle>
                        </CardBody>
                      </Card>
                    );
                  } else {
                    return (
                      <ListGroup flush numbered>
                        {finishedQuestions?.map((question) => (
                          <ListGroupItem key={question?.id}>
                            {question?.title}{" "}
                            <Badge pill className="float-end" color={`${question?.isSuccess ? "success" : "danger"}`}>
                              {question?.feedback}
                            </Badge>
                          </ListGroupItem>
                        ))}
                      </ListGroup>
                    );
                  }
                })()}
                {(() => {
                  if (currentQuestion !== null) {
                    return (
                      <Card>
                        <CardBody>
                          <CardTitle tag="h5">{currentQuestion?.title}</CardTitle>
                          <ButtonGroup vertical className="w-100">
                            {currentQuestion?.answers?.map((answer) => (
                              <Button onClick={(e) => nextQuestion({ currentQuestion, currentAnswer: answer })} key={answer?.id}>
                                {answer?.title}
                              </Button>
                            ))}
                          </ButtonGroup>
                        </CardBody>
                      </Card>
                    );
                  }
                })()}
              </>
            );
          }
        })()}
      </Container>
    </>
  );
}

export default connect((state) => state, { createQuiz })(QuizQuestions);

export const CREATEQUIZ = "CREATEQUIZ";

export const createQuiz = (quiz) => {
  return (dispatch) => {
    dispatch({ type: CREATEQUIZ, payload: quiz });
  };
};

const INITIAL_STATE = {
  quizzes: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CREATEQUIZ:
      return {
        ...state,
        quizzes: action.payload,
      };
    default:
      return state;
  }
};

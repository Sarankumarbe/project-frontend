import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentTest: null,
  testQuestions: [],
  userAnswers: {},
  markedQuestions: [],
  currentQuestionIndex: 0,
  timeRemaining: 0,
  testStarted: false,
  testCompleted: false,
  testResults: null,
  loading: false,
  error: null,
};

const testSlice = createSlice({
  name: "test",
  initialState,
  reducers: {
    initializeTest: (state, action) => {
      state.currentTest = action.payload.test;
      state.testQuestions = action.payload.questions;
      state.timeRemaining = action.payload.duration * 60; // Convert minutes to seconds
      state.userAnswers = {};
      state.markedQuestions = [];
      state.currentQuestionIndex = 0;
      state.testStarted = false;
      state.testCompleted = false;
    },
    startTest: (state) => {
      state.testStarted = true;
    },
    updateAnswer: (state, action) => {
      const { questionId, answer } = action.payload;
      state.userAnswers[questionId] = answer;
    },
    markQuestion: (state, action) => {
      const questionId = action.payload;
      if (!state.markedQuestions.includes(questionId)) {
        state.markedQuestions.push(questionId);
      }
    },
    unmarkQuestion: (state, action) => {
      const questionId = action.payload;
      state.markedQuestions = state.markedQuestions.filter(
        (id) => id !== questionId
      );
    },
    setCurrentQuestion: (state, action) => {
      state.currentQuestionIndex = action.payload;
    },
    updateTimer: (state) => {
      if (state.timeRemaining > 0) {
        state.timeRemaining -= 1;
      }
    },
    completeTest: (state, action) => {
      state.testCompleted = true;
      state.testResults = action.payload;
    },
    resetTest: (state) => {
      return initialState;
    },
  },
});

export const {
  initializeTest,
  startTest,
  updateAnswer,
  markQuestion,
  unmarkQuestion,
  setCurrentQuestion,
  updateTimer,
  completeTest,
  resetTest,
} = testSlice.actions;
export default testSlice.reducer;

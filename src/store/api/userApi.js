import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/user",
    credentials: "include", // This ensures cookies are sent with requests
    prepareHeaders: (headers, { getState }) => {
      // Since token is in cookies, we don't need to set authorization header
      // The browser will automatically send cookies
      return headers;
    },
  }),
  tagTypes: ["Course", "Test", "Profile", "Purchase"],
  endpoints: (builder) => ({
    // Auth endpoints
    userLogin: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),

    userRegister: builder.mutation({
      query: (userData) => ({
        url: "/signup",
        method: "POST",
        body: userData,
      }),
    }),

    // Logout endpoint
    userLogout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),

    getAllCourses: builder.query({
      query: () => "/courses",
    }),

    getCartItems: builder.query({
      query: (userId) => `/cart/${userId}`,
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation({
      query: (data) => ({
        url: "/cart/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation({
      query: (data) => ({
        url: "/cart/remove",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),
    createOrder: builder.mutation({
      query: (data) => ({
        url: "/create-order",
        method: "POST",
        body: data,
      }),
    }),
    verifyPayment: builder.mutation({
      query: (data) => ({
        url: "/verify",
        method: "POST",
        body: data,
      }),
    }),
    getUserCourses: builder.query({
      query: (userId) => `/my-courses/${userId}`,
    }),
    getPurchasedCourseDetails: builder.query({
      query: ({ courseId, userId }) => ({
        url: `/purchased-course-details/${courseId}`,
        method: "POST",
        body: { userId },
      }),
      // Add transformResponse if needed
    }),
    getQuestionPaperForPurchasedUser: builder.query({
      query: ({ questionPaperId, userId }) => ({
        url: `/question-paper/${questionPaperId}`,
        method: "POST",
        body: { userId },
      }),
      transformResponse: (response) => response.questionPaper,
    }),
    submitAnswers: builder.mutation({
      query: ({ userId, questionPaperId, answers }) => ({
        url: "/submit-answers",
        method: "POST",
        body: { userId, questionPaperId, answers },
      }),
    }),
    getSubmission: builder.query({
      query: ({ questionPaperId }) => ({
        url: `/submission/${questionPaperId}`,
        method: "GET",
      }),
      providesTags: ["Submission"],
    }),
  }),
});

export const {
  // Auth
  useUserLoginMutation,
  useUserRegisterMutation,
  useUserLogoutMutation,

  //home page courses
  useGetAllCoursesQuery,

  //cart apis
  useGetCartItemsQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,

  //payment apis
  useCreateOrderMutation,
  useVerifyPaymentMutation,

  //user bought courses
  useGetUserCoursesQuery,
  useGetPurchasedCourseDetailsQuery,
  useGetQuestionPaperForPurchasedUserQuery,
  useSubmitAnswersMutation,
  useGetSubmissionQuery,
} = userApi;

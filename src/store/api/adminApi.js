import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/admin",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      // Since token is in cookies, we don't need to set authorization header
      // The browser will automatically send cookies
      return headers;
    },
  }),
  tagTypes: ["Course", "User", "Payment", "Content"],
  endpoints: (builder) => ({
    // Auth endpoints
    adminLogin: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // Logout endpoint
    adminLogout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),

    uploadQuestionPaper: builder.mutation({
      query: (formData) => ({
        url: "/upload-questions",
        method: "POST",
        body: formData,
      }),
    }),

    saveQuestions: builder.mutation({
      query: (data) => ({
        url: "/save-questions",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    getQuestionPapers: builder.query({
      query: () => "/question-papers",
      providesTags: ["QuestionPaper"],
    }),

    getQuestionPaper: builder.query({
      query: (id) => `/question-paper/${id}`,
      providesTags: (result, error, id) => [{ type: "QuestionPaper", id }],
    }),

    updateQuestionPaper: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/update-question-paper/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "QuestionPaper", id },
        "QuestionPaper",
      ],
    }),

    deleteQuestionPaper: builder.mutation({
      query: (id) => ({
        url: `/delete-question-paper/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["QuestionPaper"],
    }),
  }),
});

export const {
  // Auth
  useAdminLoginMutation,
  useAdminLogoutMutation,

  // Course Management
  useUploadQuestionPaperMutation,
  useSaveQuestionsMutation,
  useGetQuestionPaperQuery,
  useGetQuestionPapersQuery,
  useUpdateQuestionPaperMutation,
  useDeleteQuestionPaperMutation,
} = adminApi;

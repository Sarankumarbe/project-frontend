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

    getCourses: builder.query({
      query: ({ page = 1, limit = 10, search = "" } = {}) => ({
        url: "/courses",
        params: { page, limit, search },
      }),
      providesTags: (result) =>
        result?.courses
          ? [
              ...result.courses.map(({ _id }) => ({ type: "Course", id: _id })),
              { type: "Course", id: "LIST" },
            ]
          : [{ type: "Course", id: "LIST" }],
    }),

    getCourseById: builder.query({
      query: (id) => `/courses/${id}`,
      providesTags: (result, error, id) => [{ type: "Course", id }],
    }),

    createCourse: builder.mutation({
      query: (courseData) => ({
        url: "/courses",
        method: "POST",
        body: courseData,
      }),
      invalidatesTags: [{ type: "Course", id: "LIST" }],
    }),

    updateCourse: builder.mutation({
      query: ({ id, data }) => ({
        url: `/courses/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Course", id },
        { type: "Course", id: "LIST" },
      ],
    }),
    getPayments: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        status = "",
        sortBy = "createdAt",
        sortOrder = "desc",
      } = {}) => ({
        url: "/payments",
        params: {
          page,
          limit,
          search,
          status,
          sortBy,
          sortOrder,
        },
      }),
      providesTags: ["Payments"],
      // Transform response to make it easier to use in components
      transformResponse: (response) => {
        return {
          payments: response.data.payments,
          pagination: response.data.pagination,
        };
      },
    }),
    getPaymentStats: builder.query({
      query: () => "/payments/stats",
      providesTags: ["PaymentStats"],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  // Auth
  useAdminLoginMutation,
  useAdminLogoutMutation,

  // Question paper Management
  useUploadQuestionPaperMutation,
  useSaveQuestionsMutation,
  useGetQuestionPaperQuery,
  useGetQuestionPapersQuery,
  useUpdateQuestionPaperMutation,
  useDeleteQuestionPaperMutation,

  //courses
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,

  //Payments
  useGetPaymentsQuery,
  useGetPaymentStatsQuery,
} = adminApi;

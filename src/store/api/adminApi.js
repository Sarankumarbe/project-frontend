import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/admin",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
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

    // Course Management
    createCourse: builder.mutation({
      query: (courseData) => ({
        url: "/courses",
        method: "POST",
        body: courseData,
      }),
      invalidatesTags: ["Course"],
    }),

    uploadQuestionPaper: builder.mutation({
      query: (formData) => ({
        url: "/courses/upload-questions",
        method: "POST",
        body: formData,
      }),
    }),

    parseQuestionPaper: builder.mutation({
      query: (fileData) => ({
        url: "/courses/parse-questions",
        method: "POST",
        body: fileData,
      }),
    }),

    updateQuestions: builder.mutation({
      query: ({ courseId, questions }) => ({
        url: `/courses/${courseId}/questions`,
        method: "PUT",
        body: { questions },
      }),
      invalidatesTags: ["Course"],
    }),

    getCourses: builder.query({
      query: () => "/courses",
      providesTags: ["Course"],
    }),

    getCourse: builder.query({
      query: (id) => `/courses/${id}`,
      providesTags: ["Course"],
    }),

    updateCourse: builder.mutation({
      query: ({ id, ...courseData }) => ({
        url: `/courses/${id}`,
        method: "PUT",
        body: courseData,
      }),
      invalidatesTags: ["Course"],
    }),

    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course"],
    }),

    // User Management
    getUsers: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) =>
        `/users?page=${page}&limit=${limit}&search=${search}`,
      providesTags: ["User"],
    }),

    getUser: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: ["User"],
    }),

    updateUser: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    // Payment Management
    getPayments: builder.query({
      query: ({ page = 1, limit = 10, status = "" }) =>
        `/payments?page=${page}&limit=${limit}&status=${status}`,
      providesTags: ["Payment"],
    }),

    getPaymentAnalytics: builder.query({
      query: ({ startDate, endDate }) =>
        `/analytics/payments?startDate=${startDate}&endDate=${endDate}`,
    }),

    // Content Management
    getPageContent: builder.query({
      query: (pageName) => `/content/${pageName}`,
      providesTags: ["Content"],
    }),

    updatePageContent: builder.mutation({
      query: ({ pageName, content }) => ({
        url: `/content/${pageName}`,
        method: "PUT",
        body: { content },
      }),
      invalidatesTags: ["Content"],
    }),

    getNews: builder.query({
      query: () => "/news",
      providesTags: ["Content"],
    }),

    createNews: builder.mutation({
      query: (newsData) => ({
        url: "/news",
        method: "POST",
        body: newsData,
      }),
      invalidatesTags: ["Content"],
    }),

    updateNews: builder.mutation({
      query: ({ id, ...newsData }) => ({
        url: `/news/${id}`,
        method: "PUT",
        body: newsData,
      }),
      invalidatesTags: ["Content"],
    }),

    deleteNews: builder.mutation({
      query: (id) => ({
        url: `/news/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Content"],
    }),

    // Dashboard Stats
    getDashboardStats: builder.query({
      query: () => "/dashboard/stats",
    }),
  }),
});

export const {
  // Auth
  useAdminLoginMutation,

  // Course Management
  useCreateCourseMutation,
  useUploadQuestionPaperMutation,
  useParseQuestionPaperMutation,
  useUpdateQuestionsMutation,
  useGetCoursesQuery,
  useGetCourseQuery,
  useUpdateCourseMutation,
  useDeleteCourseMutation,

  // User Management
  useGetUsersQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,

  // Payment Management
  useGetPaymentsQuery,
  useGetPaymentAnalyticsQuery,

  // Content Management
  useGetPageContentQuery,
  useUpdatePageContentMutation,
  useGetNewsQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,

  // Dashboard
  useGetDashboardStatsQuery,
} = adminApi;

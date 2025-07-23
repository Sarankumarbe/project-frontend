import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/user",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Course", "Test", "Profile", "Purchase"],
  endpoints: (builder) => ({
    // Auth endpoints
    userLogin: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    userRegister: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),

    // Public endpoints
    getPublicCourses: builder.query({
      query: ({ page = 1, limit = 10, category = "", search = "" }) =>
        `/courses/public?page=${page}&limit=${limit}&category=${category}&search=${search}`,
      providesTags: ["Course"],
    }),

    getPublicCourse: builder.query({
      query: (id) => `/courses/public/${id}`,
      providesTags: ["Course"],
    }),

    getNews: builder.query({
      query: ({ page = 1, limit = 5 }) => `/news?page=${page}&limit=${limit}`,
    }),

    getPageContent: builder.query({
      query: (pageName) => `/content/${pageName}`,
    }),

    // Course Purchase
    purchaseCourse: builder.mutation({
      query: (courseId) => ({
        url: `/courses/${courseId}/purchase`,
        method: "POST",
      }),
      invalidatesTags: ["Purchase", "Course"],
    }),

    // User Dashboard
    getUserCourses: builder.query({
      query: () => "/dashboard/courses",
      providesTags: ["Purchase"],
    }),

    getTestHistory: builder.query({
      query: () => "/dashboard/test-history",
      providesTags: ["Test"],
    }),

    // Test Taking
    getTest: builder.query({
      query: (courseId) => `/tests/${courseId}`,
      providesTags: ["Test"],
    }),

    startTest: builder.mutation({
      query: (courseId) => ({
        url: `/tests/${courseId}/start`,
        method: "POST",
      }),
      invalidatesTags: ["Test"],
    }),

    submitTest: builder.mutation({
      query: ({ courseId, answers }) => ({
        url: `/tests/${courseId}/submit`,
        method: "POST",
        body: { answers },
      }),
      invalidatesTags: ["Test"],
    }),

    getTestResults: builder.query({
      query: (testId) => `/tests/${testId}/results`,
      providesTags: ["Test"],
    }),

    // Profile Management
    getProfile: builder.query({
      query: () => "/profile",
      providesTags: ["Profile"],
    }),

    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: "/profile",
        method: "PUT",
        body: profileData,
      }),
      invalidatesTags: ["Profile"],
    }),

    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: "/profile/change-password",
        method: "PUT",
        body: passwordData,
      }),
    }),
  }),
});

export const {
  // Auth
  useUserLoginMutation,
  useUserRegisterMutation,

  // Public
  useGetPublicCoursesQuery,
  useGetPublicCourseQuery,
  useGetNewsQuery,
  useGetPageContentQuery,

  // Course Purchase
  usePurchaseCourseMutation,

  // Dashboard
  useGetUserCoursesQuery,
  useGetTestHistoryQuery,

  // Test Taking
  useGetTestQuery,
  useStartTestMutation,
  useSubmitTestMutation,
  useGetTestResultsQuery,

  // Profile
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = userApi;

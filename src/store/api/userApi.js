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
  }),
});

export const {
  // Auth
  useUserLoginMutation,
  useUserRegisterMutation,
  useUserLogoutMutation,

  //home page courses
  useGetAllCoursesQuery,
} = userApi;

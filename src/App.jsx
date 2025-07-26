// src/App.jsx
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import store from "./store";
import AppRoutes from "./AppRoutes";

const antdTheme = {
  token: {
    colorPrimary: "#1890ff",
    borderRadius: 6,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
};

function App() {
  return (
    <Provider store={store}>
      <ConfigProvider theme={antdTheme}>
        <Router>
          <div className="App">
            <AppRoutes />
          </div>
        </Router>
      </ConfigProvider>
    </Provider>
  );
}

export default App;

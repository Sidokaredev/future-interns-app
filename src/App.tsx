/* Material Customize Theme */
import { ThemeProvider } from "@mui/material";
import FutureInternsTheme from "./Themes";
/* Route */
import { RouterProvider } from "react-router-dom";
import _APPROUTERS from "./routes";

function App() {
  return (
    <ThemeProvider theme={FutureInternsTheme}>
      <RouterProvider router={_APPROUTERS} />
    </ThemeProvider>
  );
}

export default App;

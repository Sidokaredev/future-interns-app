// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
/* Material Customize Theme */
import { ThemeProvider } from '@mui/material'
import FutureInternsTheme from './Themes'
// import './App.css'
/* Route */
import { RouterProvider } from 'react-router-dom'
import _APPROUTERS from './routes'



function App() {
  return (
    <ThemeProvider theme={FutureInternsTheme}>
      <RouterProvider router={_APPROUTERS}/>
    </ThemeProvider>
  )
};

export default App

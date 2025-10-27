import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import UserDirectory from './components/UserDirectory'
import './App.css'

const theme = createTheme()

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <h1>User Directory</h1>
        <UserDirectory />
      </div>
    </ThemeProvider>
  );
}
    </>
  )
}

export default App

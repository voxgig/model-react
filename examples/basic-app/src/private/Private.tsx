import { BasicAdmin } from '@voxgig/model-react'

import { getMain } from '../setup'
import Chat from './Chat'
import ExampleLedHead from './ExampleLedHead'
import ExampleLedFoot from './ExampleLedFoot'
import { ThemeProvider, createTheme } from '@mui/material'
import { orange, green, blue, red, purple, cyan } from '@mui/material/colors'

const main = getMain()

const darkTheme = createTheme({
  components: {
    MuiDrawer: {
      defaultProps: {
        variant: 'persistent'
      },
      styleOverrides: {
        root: {
          width: '16rem',
          flexShrink: 0
        },
        paper: {
          width: '16rem',
          boxSizing: 'border-box'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderColor: green[500],
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: purple[500]
          },
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
            {
              borderColor: green[500]
            },
          '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: blue[500]
          }
        }
      }
    },
    MuiAutocomplete: {
      defaultProps: {
        popupIcon: true
      },
      styleOverrides: {
        root: {
          marginLeft: '1em',
          width: '20rem',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: purple[500]
          },
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
            {
              borderColor: green[500]
            },
          '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: blue[500]
          }
        }
      }
    }
  },
  palette: {
    mode: 'dark',
    background: {
      default: '#191c29',
      paper: '#262937'
    },
    primary: {
      main: red[500]
    }
  },
  typography: {
    body1: {
      color: 'white'
    },
    h2: {
      color: 'white'
    }
  }
})

const lightTheme = createTheme({
  components: {
    MuiDrawer: {
      defaultProps: {
        variant: 'persistent'
      },
      styleOverrides: {
        root: {
          width: '16rem',
          flexShrink: 0
        },
        paper: {
          width: '16rem',
          boxSizing: 'border-box'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          '& .MuiToolbar-root': {
            backgroundColor: '#ffffff'
          }
        }
      }
    },
    MuiTable: {
      styleOverrides: {
        root: {
          color: 'red',
          backgroundColor: 'white',
          '& .MuiTableRow-root': {
            color: 'red',
            backgroundColor: '#ffffff'
          },
          '& .MuiToolbar-root': {
            color: 'red',
            backgroundColor: '#ffffff'
          }
        }
      }
    },
    MuiAutocomplete: {
      defaultProps: {
        popupIcon: true
      },
      styleOverrides: {
        root: {
          marginLeft: '1em',
          width: '20rem'
        }
      }
    }
  },
  palette: {
    mode: 'light',
    background: {
      default: '#eee',
      paper: '#ffffff'
    }
  }
})

// Provided as a function to prevent deep inspection.
const ctx = () => ({
  model: main.model,
  seneca: main.seneca,
  store: main.store,
  theme: darkTheme,
  cmp: {
    Chat: Chat,
    ExampleLedHead: ExampleLedHead,
    ExampleLedFoot: ExampleLedFoot
  },
  custom: {
    BasicLed: {
      query: (view: any, cmpstate: any) => {}
    }
  }
})

const spec = {
  frame: 'private'
}

function Private (props: any) {
  return (
    <ThemeProvider theme={ctx().theme}>
      <div className='Private'>
        <BasicAdmin ctx={ctx} spec={spec} />
      </div>
    </ThemeProvider>
  )
}

export default Private

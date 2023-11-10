import { BasicAdmin } from '@voxgig/model-react'

import { getMain } from '../setup'
import Chat from './Chat'
import BasicLedHead from './BasicLedHead'
import BasicLedFoot from './BasicLedFoot'
import { ThemeProvider, createTheme } from '@mui/material'
import { green, red } from '@mui/material/colors'

const main = getMain()

// Provided as a function to prevent deep inspection.
const ctx = () => ({
  model: main.model,
  seneca: main.seneca,
  store: main.store,
  cmp: {
    Chat: Chat,
    BasicLedHead: BasicLedHead,
    BasicLedFoot: BasicLedFoot
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
      }
    },
    palette: {
      mode: 'dark',
      background: {
        default: '#191c29',
        paper: '#262937'
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

  return (
    <ThemeProvider theme={darkTheme}>
      <div className='Private'>
        <BasicAdmin ctx={ctx} spec={spec} />
      </div>
    </ThemeProvider>
  )
}

export default Private

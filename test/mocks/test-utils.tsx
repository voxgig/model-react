import React from 'react'
import { render, screen, RenderOptions } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'
import { createTheme } from '@mui/material'

interface IExtendedRenderOptions extends RenderOptions {
  withRouter?: boolean
  withRedux?: boolean
  mockInitialState?: any
}

const wrapInRouter = (componentTree: JSX.Element) => (
  <BrowserRouter>{componentTree}</BrowserRouter>
)

const wrapInRedux = (
  componentTree: JSX.Element,
  { mockInitialState }: IExtendedRenderOptions
) => {
  const storeMock = configureStore([thunk])(mockInitialState)
  return <Provider store={storeMock}>{componentTree}</Provider>
}

const setupComponent = (
  ui: JSX.Element,
  renderOptions?: IExtendedRenderOptions
) => {
  let componentTree = <>{ui}</>
  componentTree = wrapInRouter(componentTree)
  componentTree = wrapInRedux(componentTree, renderOptions)
  return componentTree
}

export function customRender(
  ui: JSX.Element,
  renderOptions?: IExtendedRenderOptions
) {
  const componentTree = setupComponent(ui, renderOptions)

  const { debug: originalDebug, ...rest } = render(componentTree)

  const debug = () => {
    originalDebug()
  }

  return {
    debug,
    screen,
    ...rest
  }
}

export const vxg = {
  cmp: {
    BasicSide: { show: {} }
  },
  trigger: { led: { add: {} } },
  ent: {
    meta: { main: { canon: { state: {} } } },
    list: { main: { canon: {} } }
  }
}

const lightTheme = createTheme({
  components: {
    MuiDrawer: {
      defaultProps: {
        variant: 'persistent'
      },
      styleOverrides: {
        root: {
          // persistent sidebar
          width: '16rem',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: '16rem',
            boxSizing: 'border-box'
          },
          anchor: 'left'
        },
        // permanent sidebar
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
  },
  typography: {
    h6: {
      color: 'black'
    }
  }
})

export const ctx = () => {
  return {
    model: {
      app: {
        web: {
          frame: {
            public: {
              kind: 'basic'
            },
            private: {
              kind: 'basic',
              part: {
                admin: {},
                head: {
                  logo: {
                    img: '/voxgig.png'
                  },
                  variant: 'persistent',
                  tool: {
                    def: {
                      addbutton: {
                        kind: 'add',
                        label: 'Add',
                        defaultvalue: 'Add',
                        options: {
                          kind: 'ent',
                          label: {
                            field: 'title'
                          },
                          ent: 'vxg/task'
                        }
                      },
                      autocomplete: {
                        kind: 'autocomplete',
                        label: 'Autocomplete',
                        defaultvalue: 'Autocomplete',
                        options: {
                          kind: 'ent',
                          label: {
                            field: 'title'
                          },
                          ent: 'vxg/task'
                        }
                      }
                    }
                  }
                },
                side: {
                  logo: {
                    img: '/voxgig.png'
                  },
                  variant: 'persistent',
                  section: {
                    section1: {
                      title: 'Section 1',
                      divider: true,
                      item: {
                        task: {
                          kind: 'resource',
                          label: 'Tasks',
                          icon: 'done',
                          path: 'view/task',
                          access: {
                            admin: true,
                            user: true
                          }
                        }
                      }
                    }
                  }
                },
                main: {
                  title: 'Main',
                  default: 'view/task/index'
                },
                foot: {
                  title: 'Footer'
                }
              },
              view: {
                task: {
                  title: 'Task',
                  name: 'task',
                  content: {
                    def: {
                      canon: 'vxg/task',
                      subview: {
                        index: {
                          kind: 'led',
                          editingMode: 'row'
                        },
                        edit: {},
                        show: {}
                      },
                      field: {
                        id: {
                          label: 'ID',
                          inputType: 'text',
                          required: true,
                          editable: false,
                          kind: 'String'
                        },
                        title: {
                          kind: 'String',
                          inputType: 'text',
                          label: 'Title',
                          required: true,
                          editable: true
                        },
                        status: {
                          kind: 'String',
                          inputType: 'select',
                          label: 'Status',
                          required: true,
                          editable: true,
                          options: {
                            open: {
                              label: 'Open'
                            },
                            closed: {
                              label: 'Closed'
                            }
                          }
                        }
                      },
                      id: {
                        field: 'id'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    content: {},
    seneca: {
      entity: () => ({
        list$: q => Promise.resolve([]) // Mock the list$ function to return an empty array
      })
    },
    custom: {
      BasicLed: {
        query: (view: any, cmpstate: any) => {}
      }
    },
    cmp: {},
    theme: lightTheme
  }
}

export const spec = {
  frame: 'private'
}

export const initialState = {
  main: {
    auth: { user: { name: 'name' } },
    vxg: {
      cmp: {
        BasicHead: {
          tool: {
            addbutton: {},
            autocomplete: {
              selected: {
                title: 'Title'
              }
            }
          }
        },
        BasicSide: {
          show: true
        }
      },
      trigger: { led: { add: {} } },
      ent: {
        list: {
          main: {
            'vxg/task': [
              {
                entity$: '-/vxg/task',
                id: 't01',
                title: 'Task 1',
                status: 'open'
              }
            ]
          }
        },
        meta: {
          main: {
            'vxg/task': { state: 'loaded' }
          }
        }
      }
    }
  }
}

# @voxgig/model-react

Voxgig Model React Components

## How-to guides

### Customizing components

Since model-react is using Material UI under the hood, it should fairly easy to customize model-react components. Here's an example of how achieve that: 

1. First create your custom theme:

    ```javascript
    import { createTheme } from '@mui/material'
    const customTheme = createTheme({
        palette: {
            mode: 'dark',
            background: {
            default: '#191c29',
            paper: '#262937'
            },
            primary: {
            main: red[500]
            }
        }
    })
    ```

2. Add your theme to `ctx` and wrap your components in `ThemeProvider`:

    ```javascript
    const ctx = () => ({
        ...
        theme: customTheme,
        ...
    })

    ...

    <ThemeProvider theme={ctx().theme}>
      <div className='Private'>
        <BasicAdmin ctx={ctx} spec={spec} />
      </div>
    </ThemeProvider>
    ```

That's it.

## Contributing

### How to run in dev mode

`npm run watch`

### How to format and/or lint

* You can format by running `npm run format`
* You can lint and format by running `npm run lint`
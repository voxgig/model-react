# @voxgig/model-react

Voxgig Model React is a library of model-driven React Enterprise UI components.


## Installation 

```
npm install @voxgig/model-react
```

## Quickstart
The best place to start would be to run (and experiment with) the example app in [`examples/basic-app`](https://github.com/voxgig/model-react/tree/main/examples/basic-app).

```
git clone git@github.com:voxgig/model-react.git
cd model-react/examples/basic-app 
```

Install it and run: 

```
npm install
npm run dev
```



## How-to guides

### Customize Model React with your theme

Model React components are built on top of Material UI, so it should be fairly easy to customize it with your theme. 

Here's an example of how to change the color palette of your app:

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

2. Pass your theme to the context variable, make sure to wrap your components in `ThemeProvider`:

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

You can see a full example of this in [`examples/basic-app/src/private/Private.tsx`](https://github.com/voxgig/model-react/blob/main/examples/basic-app/src/private/Private.tsx)

## Contributing

### Run in dev mode

```
git clone git@github.com:voxgig/model-react.git
cd model-react
npm run watch
```

### Format and/or lint

* You can format by running `npm run format`
* You can lint and format by running `npm run lint`
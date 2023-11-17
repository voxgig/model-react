import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Gubu, Exact } from 'gubu'
import { Toolbar, Typography, IconButton, useTheme } from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import BasicButton from './BasicButton'
import BasicAppBar from './BasicAppBar'
import BasicAutocomplete from './BasicAutocomplete'

const { Child } = Gubu

// Define spec shape with Gubu
const BasicHeadSpecShape = Gubu({
  head: {
    logo: {
      img: String
    },
    variant: String,
    tool: {
      def: Child({
        kind: Exact('add', 'autocomplete'),
        label: String,
        options: {
          kind: String,
          label: {
            field: String
          },
          ent: String
        },
        name: ''
      })
    },
    app: {}
  },
  view: {}
})

interface BasicHeadProps {
  ctx: any
  spec: any
  vxg?: any
}

function BasicHead (props: BasicHeadProps) {
  const location = useLocation()
  const { ctx } = props
  const { seneca } = ctx()

  // spec shape validation with Gubu
  const basicHeadSpec = BasicHeadSpecShape(props.spec)

  // set userName to user.name or user.email
  const user = useSelector((state: any) => state.main.auth.user)
  const userName = user.name || user.email

  // add name property to each tool definition
  const tooldefs = Object.entries(basicHeadSpec.head.tool.def).map(
    (entry: any) => ((entry[1].name = entry[0]), entry[1])
  )

  //  get open and led_add state from redux
  const vxgState = useSelector((state: any) => state.main.vxg)
  const open = vxgState.cmp.BasicSide.show
  let led_add = vxgState.trigger.led.add

  // get name and add state from spec
  const viewPath: any = location.pathname.split('/')[2]
  let add = basicHeadSpec.view[viewPath]?.content?.def?.add || { active: false }
  const viewName = basicHeadSpec.view[viewPath]?.name || ''

  const theme = useTheme()

  if (basicHeadSpec.head.variant === 'permanent') {
    return (
      <BasicAppBar
        open={false}
        sx={{
          backgroundColor: theme.palette.background.paper
        }}
      >
        <Toolbar>
          <img src={basicHeadSpec.head.logo.img} style={{ width: '5rem' }} />
          <div style={{ flexGrow: 1 }}></div>
          <Typography variant='h6'>{userName}</Typography>
        </Toolbar>
      </BasicAppBar>
    )
  } else {
    return (
      <BasicAppBar
        // position="fixed"
        drawerwidth='16rem'
        open={open}
        sx={{
          backgroundColor: theme.palette.background.paper
        }}
      >
        <Toolbar>
          <IconButton
            aria-label='open drawer'
            onClick={() => onOpen(seneca)}
            edge='start'
            sx={{
              marginRight: 2,
              ...(open && { display: 'none' })
            }}
          >
            <ChevronRightIcon />
          </IconButton>

          {tooldefs.map(tooldef => {
            if ('autocomplete' === tooldef.kind) {
              return (
                <BasicAutocomplete
                  spec={{ tooldef: tooldef }}
                  ctx={ctx}
                  key={tooldef.name}
                />
              )
            } else if ('add' === tooldef.kind) {
              return (
                <BasicButton
                  variant='outlined'
                  key={tooldef.name}
                  sx={{
                    display: add.active ? null : 'none',
                    textTransform: 'capitalize'
                  }}
                  size='large'
                  onClick={() => addItem(seneca, led_add)}
                >
                  {tooldef.label + ' ' + viewName}
                </BasicButton>
              )
            }
          })}

          <div style={{ flexGrow: 1 }}></div>

          <Typography variant='h6'>{userName}</Typography>
        </Toolbar>
      </BasicAppBar>
    )
  }
}

export default BasicHead

// updates backend when user toggles BasicSide
function onOpen (seneca: any) {
  seneca.act('aim:app,set:state', {
    section: 'vxg.cmp.BasicSide.show',
    content: true
  })
}

// notify BasicLed to switch to add mode
function addItem (seneca: any, led_add: any) {
  seneca.act('aim:app,set:state', {
    section: 'vxg.trigger.led.add',
    content: ++led_add
  })
}

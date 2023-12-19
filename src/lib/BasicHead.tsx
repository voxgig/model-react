import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Gubu, Exact } from 'gubu'
import {
  Toolbar,
  Typography,
  IconButton,
  useTheme,
  Avatar,
  Menu,
  MenuItem
} from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import BasicButton from './BasicButton'
import BasicAppBar from './BasicAppBar'
import BasicAutocomplete from './BasicAutocomplete'
import { deepPurple, purple } from '@mui/material/colors'
import { useEffect, useState } from 'react'

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
  const [initials, setInitials] = useState('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const menuOpen = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  // spec shape validation with Gubu
  const basicHeadSpec = BasicHeadSpecShape(props.spec)

  // set userName to user.name or user.email
  const user = useSelector((state: any) => state.main.auth.user)
  const userName = user.name || user.email

  console.log('model-react.user', user)

  useEffect(() => {
    const name = user.name ? user.name : 'A'
    const acronyms = name.match(/\b(\w)/g) || []
    const initials = acronyms.join('')
    console.log('initials', initials)
    setInitials(initials)
  }, [user])

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
          <BasicButton onClick={handleClick}>
            <Avatar
              sx={{ bgcolor: purple[300], color: 'white', fontWeight: 100 }}
            >
              {initials}
            </Avatar>
          </BasicButton>
          <Menu
            id='basic-menu'
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button'
            }}
          >
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
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

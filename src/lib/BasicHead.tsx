import React from 'react'

import AppBar from '@mui/material/AppBar'
import ToolBar from '@mui/material/Toolbar'

import { Gubu } from 'gubu'

import type { BasicProps, Spec } from './basic-types'

import { BasicHeadTool } from './BasicHeadTool'


const CMPNAME = 'BasicHead'
console.log(CMPNAME,'1')


const { Child, Exact, Open, Required } = Gubu
const BasicHeadSpecShape = Gubu({
  head: {
    name: String,
    active: Boolean,
  
    tool: Child(Open({
      align: Exact('left','right'),
    })),
  },

  tool: Required({}),
  
  // Set MUI component props directly 
  mui: {
    AppBar: {},
    ToolBar: {},
  }
  
}, {prefix:CMPNAME})


function BasicHead (props: BasicProps) {
  const { ctx, spec } = props
  const { seneca } = ctx()
  const { vmap } = seneca.context
  
  const basicHeadSpec: Spec = BasicHeadSpecShape(spec)
  const { head } = (basicHeadSpec as any)

  const tools = vmap(head.tool,{
    active: vmap.FILTER,
    name: vmap.FILTER((_:any,p:any)=>[basicHeadSpec.tool[p.key]?.active, p.key]),
    align: vmap.COPY,
  })
    .map((t:any)=>({
      ...basicHeadSpec.tool[t.name],
      ...t,
    }))

  // console.log('TOOLS', tools)
  
  const leftTools: Spec[] = tools.filter((t:Spec)=>'left'===t.align)
  const rightTools: Spec[] = tools.filter((t:Spec)=>'right'===t.align)

  return (
    <AppBar
      className="vxg-BasicHead"
      {...spec.mui.AppBar}
    >
      <ToolBar className="vxg-BasicHead-toolbar" {...spec.mui.ToolBar}>
        <div
          className="vxg-BasicHead-toolbar vxg-BasicHead-toolbar-left"
        >
          { leftTools.map(t=><BasicHeadTool key={t.name} ctx={ctx} spec={t} />) }
        </div>
        <div
          className="vxg-BasicHead-toolbar vxg-BasicHead-toolbar-right"
          style={{marginLeft:'auto'}}
        >
          { rightTools.map(t=><BasicHeadTool key={t.name} ctx={ctx} spec={t} />) }
        </div>
      </ToolBar>  
    </AppBar>  
  )

  
  /*
  const location = useLocation()
  const [initials, setInitials] = useState('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const menuOpen = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }


  // set userName to user.name or user.email
  const user = useSelector((state: any) => state.main.auth.user)
  const userName = user.name || user.email


  useEffect(() => {
    const name = user.name ? user.name : 'A'
    const acronyms = name.match(/\b(\w)/g) || []
    const initials = acronyms.join('')
    setInitials(initials)
  }, [user])

  // add name property to each tool definition
  const tooldefs = Object.entries(tool.def).map(
    (entry: any) => ((entry[1].name = entry[0]), entry[1])
  )

  //  get open and led_add state from redux
  const vxgState = useSelector((state: any) => state.main.vxg)
  const open = vxgState.cmp.BasicSide.show
  let led_add = vxgState.trigger.led.add

  // get name and add state from spec
  // const viewPath: any = location.pathname.split('/')[2]
  // let add = basicHeadSpec.view[viewPath]?.content?.def?.add || { active: false }
  // const viewName = basicHeadSpec.view[viewPath]?.name || ''

  const theme = useTheme()

  if (spec.variant === 'permanent') {
    return (
      <BasicAppBar
        open={false}
        sx={{
          backgroundColor: theme.palette.background.paper
        }}
      >
        <Toolbar>
          <img src={spec.logo.img} style={{ width: '5rem' }} />
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
  */
}

/*
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
*/

export {
  BasicHead
}

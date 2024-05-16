import { Theme } from '@mui/material/styles';

declare const BasicDrawerHeader: import('@emotion/styled').StyledComponent<import('@mui/system').MUIStyledCommonProps<Theme>, import('react').DetailedHTMLProps<import('react').HTMLAttributes<HTMLDivElement>, HTMLDivElement>, {}>;
interface DrawerProps {
    open?: boolean;
    drawerwidth?: any;
}
declare const BasicDrawer: import('@emotion/styled').StyledComponent<import('@mui/material/Drawer').DrawerProps & import('@mui/system').MUIStyledCommonProps<Theme> & DrawerProps, {}, {}>;
export { BasicDrawer, BasicDrawerHeader };

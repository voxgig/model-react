/// <reference types="react" />
import { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { Theme } from '@mui/material/styles';
interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
    drawerwidth?: any;
}
declare const BasicAppBar: import("@emotion/styled").StyledComponent<import("@mui/material/AppBar").AppBarOwnProps & Omit<import("@mui/material").PaperOwnProps, "classes" | "color" | "position"> & import("@mui/material/OverridableComponent").CommonProps & Omit<Omit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLElement>, HTMLElement>, "ref"> & {
    ref?: ((instance: HTMLElement | null) => void) | import("react").RefObject<HTMLElement> | null | undefined;
}, "sx" | "style" | "children" | "className" | "classes" | "color" | "position" | "variant" | "elevation" | "square" | "enableColorOnDark"> & import("@mui/system").MUIStyledCommonProps<Theme> & AppBarProps, {}, {}>;
export default BasicAppBar;

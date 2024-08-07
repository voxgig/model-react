import { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { Theme } from '@mui/material/styles';

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
    drawerwidth?: any;
}
declare const BasicAppBar: import('@emotion/styled').StyledComponent<import('@mui/material/AppBar').AppBarOwnProps & Omit<import('@mui/material').PaperOwnProps, "classes" | "color" | "position"> & import('@mui/material/OverridableComponent').CommonProps & Omit<Omit<import('react').DetailedHTMLProps<import('react').HTMLAttributes<HTMLElement>, HTMLElement>, "ref"> & {
    ref?: ((instance: HTMLElement | null) => void | import('react').DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES[keyof import('react').DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES]) | import('react').RefObject<HTMLElement> | null | undefined;
}, "sx" | "style" | "className" | "classes" | "children" | "color" | "position" | "variant" | "elevation" | "square" | "enableColorOnDark"> & import('@mui/system').MUIStyledCommonProps<Theme> & AppBarProps, {}, {}>;
export default BasicAppBar;

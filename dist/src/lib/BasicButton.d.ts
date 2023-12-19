/// <reference types="react" />
import { ButtonProps as MuiButtonProps } from '@mui/material';
import { Theme } from '@mui/material/styles';
interface BProps extends MuiButtonProps {
    theme?: Theme;
}
declare const BasicButton: import("@emotion/styled").StyledComponent<import("@mui/material").ButtonOwnProps & Omit<import("@mui/material").ButtonBaseOwnProps, "classes"> & import("@mui/material/OverridableComponent").CommonProps & Omit<Omit<import("react").DetailedHTMLProps<import("react").ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, "ref"> & {
    ref?: ((instance: HTMLButtonElement | null) => void) | import("react").RefObject<HTMLButtonElement> | null | undefined;
}, "className" | "style" | "classes" | "action" | "centerRipple" | "children" | "disabled" | "disableRipple" | "disableTouchRipple" | "focusRipple" | "focusVisibleClassName" | "LinkComponent" | "onFocusVisible" | "sx" | "tabIndex" | "TouchRippleProps" | "touchRippleRef" | "color" | "disableElevation" | "disableFocusRipple" | "endIcon" | "fullWidth" | "href" | "size" | "startIcon" | "variant"> & import("@mui/system").MUIStyledCommonProps<Theme> & BProps, {}, {}>;
export default BasicButton;

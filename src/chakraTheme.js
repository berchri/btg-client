import { extendTheme } from '@chakra-ui/react'

const colors = {
    primary: '#f17a23',
    secondary: '#00385e',
    swiorange: {
        0: '#f17a23',
        50: '#fef8f4',
        100: '#fdebde',
        200: '#fcdec8',
        300: '#fad0b2',
        400: '#f9c39c',
        500: '#f7b686',
        600: '#f6a970',
        700: '#f49b5a',
        800: '#f38e44',
        900: '#f2812e',
    },
    swiblue: {
        0: '#00385e',
        50: '#d9e1e7',
        100: '#d9e1e7',
        200: '#bfcdd7',
        300: '#a6b9c7',
        400: '#8ca5b7',
        500: '#7392a6',
        600: '#597e96',
        700: '#406a86',
        800: '#265676',
        900: '#0d4266',
    },
}

const shadows = {
    swiorange: {
        xs: "0 0 0 1px rgba(241, 122, 35, 0.05)",
        sm: "0 1px 2px 0 rgba(241, 122, 35, 0.05)",
        base: "0 1px 3px 0 rgba(241, 122, 35, 0.1), 0 1px 2px 0 rgba(241, 122, 35, 0.06)",
        md: "0 4px 6px -1px rgba(241, 122, 35, 0.1), 0 2px 4px -1px rgba(241, 122, 35, 0.06)",
        lg: "0 10px 15px -3px rgba(241, 122, 35, 0.1), 0 4px 6px -2px rgba(241, 122, 35, 0.05)",
        xl: "0 20px 25px -5px rgba(241, 122, 35, 0.1), 0 10px 10px -5px rgba(241, 122, 35, 0.04)",
        "2xl": "0 25px 50px -12px rgba(241, 122, 35, 0.25)",
        outline: "0 0 0 3px rgba(66, 153, 225, 0.6)",
        inner: "inset 0 2px 4px 0 rgba(241, 122, 35, 0.06)",
        none: "none",
        "dark-lg":
            "rgba(241, 122, 35, 0.1) 0px 0px 0px 1px, rgba(241, 122, 35, 0.2) 0px 5px 10px, rgba(241, 122, 35, 0.4) 0px 15px 40px",
    }
}

const theme = extendTheme({ colors, shadows })
export default theme
import { DefaultTheme } from 'styled-components';
import {
    blackAccent,
    brightCyan,
    brightFuscia,
    brightGreen,
    brightOrange,
    brightOrangeTwo,
    errorRed,
    offWhite,
    skyBlue,
} from './ColorPalette';

const lightTheme: DefaultTheme = {
    colors: {
        text: blackAccent,
        background: offWhite,
        accentCyan: brightCyan,
        accentGreen: brightGreen,
        accentOrange: brightOrange,
        accentOrangeOther: brightOrangeTwo,
        accentFuscia: brightFuscia,
        white: offWhite,
        black: blackAccent,
        skyBlue: skyBlue,
        errorRed: errorRed,
    },
    fontSizes: {
        small: '0.5rem',
        medium: '1rem',
        large: '1.25rem',
        xLarge: '2rem',
    },
    animationTime: {
        short: '0.3s',
        medium: '0.5s',
        long: '1s',
    },
    breakpoint: '1000px',
    borderRadius: {
        small: '0.125rem',
        medium: '0.25rem',
        large: '0.5rem',
    },
    padding: {
        small: '0.5rem',
        medium: '1rem',
        large: '2rem',
    },
};

const darkTheme: DefaultTheme = {
    colors: {
        text: offWhite,
        background: blackAccent,
        accentCyan: brightCyan,
        accentGreen: brightGreen,
        accentOrange: brightOrange,
        accentOrangeOther: brightOrangeTwo,
        accentFuscia: brightFuscia,
        white: offWhite,
        black: blackAccent,
        skyBlue: skyBlue,
        errorRed: errorRed,
    },
    fontSizes: {
        small: '0.65rem',
        medium: '0.875rem',
        large: '1rem',
        xLarge: '2rem',
    },
    animationTime: {
        short: '0.3s',
        medium: '0.5s',
        long: '1s',
    },
    breakpoint: '1000px',
    borderRadius: {
        small: '0.125rem',
        medium: '0.25rem',
        large: '0.5rem',
    },
    padding: {
        small: '0.5rem',
        medium: '1rem',
        large: '2rem',
    },
};

export { lightTheme, darkTheme };

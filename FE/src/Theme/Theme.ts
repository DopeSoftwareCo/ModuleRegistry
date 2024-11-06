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
        xSmall: '0.5rem',
        small: '1rem',
        medium: '1.5rem',
        large: '2rem',
        xLarge: '3rem',
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
        xSmall: '0.5rem',
        small: '1rem',
        medium: '1.5rem',
        large: '2rem',
        xLarge: '3rem',
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

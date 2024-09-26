import 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
        colors: {
            text: string;
            background: string;
            accentCyan: string;
            accentGreen: string;
            accentOrange: string;
            accentOrangeOther: string;
            accentFuscia: string;
            white: string;
            black: string;
            skyBlue: string;
        };
        fontSizes: {
            small: string;
            medium: string;
            large: string;
            xLarge: string;
        };
        animationTime: {
            short: string;
            medium: string;
            long: string;
        };
        breakpoint: string;
        borderRadius: {
            small: string;
            medium: string;
            large: string;
        };
        padding: {
            small: string;
            medium: string;
            large: string;
        };
    }
}

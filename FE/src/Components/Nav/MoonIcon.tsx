import { useTheme } from 'styled-components';
import { MoonPath, MoonSVG } from './MoonIconStyle';
import { useAppDispatch } from '../../Hooks/Redux/redux.hook';
import { swapTheme } from '../../Redux/ThemeSlice';

export const MoonIcon = () => {
    const dispatch = useAppDispatch();
    const theme = useTheme();
    return (
        <MoonSVG
            xmlns="http://www.w3.org/2000/svg"
            width={22}
            height={22}
            onClick={() => dispatch(swapTheme())}
        >
            {' '}
            <g>
                {' '}
                <path fill="none" d="M0 0h24v24H0z" />{' '}
                <MoonPath
                    fill={theme.colors.text}
                    fillRule="nonzero"
                    d="M10 7a7 7 0 0 0 12 4.9v.1c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2h.1A6.979 6.979 0 0 0 10 7zm-6 5a8 8 0 0 0 15.062 3.762A9 9 0 0 1 8.238 4.938 7.999 7.999 0 0 0 4 12z"
                />{' '}
            </g>{' '}
        </MoonSVG>
    );
};

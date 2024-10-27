import styled, { css } from 'styled-components';
import { rgba } from 'polished';

interface Props {
    $active: boolean;
}

export const MobileMenuSVG = styled.svg``;

export const MobileMenuPathStyled = styled.path``;

interface NavContainerProps {
    $show: boolean;
}

export const NavContainer = styled.div<NavContainerProps>`
    transition: 0.3s all ease;
    position: fixed;
    top: 0px;
    transform: translateY(${({ $show }) => ($show ? '-70px' : '0px')});
    height: 70px;
    width: calc(100% - 40px);
    color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0px 20px;
    z-index: 90;
    opacity: 1;
    caret-color: transparent;
    ${({ theme }) => css`
        transition: ${theme.animationTime.short} all ease;
        background: ${rgba(
            theme.colors.background,
            theme.colors.background === theme.colors.white ? 0.87 : 0.95
        )};
    `}
`;

export const IconTextMoonContainer = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    height: 100%;
    @media screen and (max-width: ${(props) => props.theme.breakpoint}px) {
        width: 100px;
    }
`;

export const MobileIcon = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
`;

export const NameText = styled.div`
    font-weight: 700;
    font-size: 30px;
    padding: 0;
    line-height: 25px;
    text-align: center;
    color: ${(props) => props.theme.colors.text};
`;

export const MobileMenuText = styled.div`
    font-weight: 700;
    font-size: 25px;
    text-align: cetner;
    color: ${(props) => props.theme.colors.text};
`;

export const FakeCheckBox = styled.input<Props>`
    position: relative;
    top: 0;
    left: 0;
    width: 30px;
    height: 50px;
    z-index: ${(props) => (props.$active ? '5' : '3')};
    opacity: 0;
    padding: 0;
    margin: 0;
`;

export const BurgerCheckHolder = styled.div`
    z-index: 2;
    height: 50px;
    caret-color: transparent;
`;

export const SpanOne = styled.div<Props>`
    transition: 0.3s all ease;
    position: relative;
    z-index: 2;
    height: 4px;
    width: 30px;
    border-radius: 10px;
    ${({ theme, $active }) => css`
        top: ${$active ? '-30px' : '-40px'};
        background: ${$active ? theme.colors.skyBlue : theme.colors.text};
        transform: rotate(${$active ? '-45deg' : '0deg'});
    `}
`;

export const SpanTwo = styled.div<Props>`
    transition: 0.3s all ease;
    position: relative;
    top: -34px;
    height: 4px;
    width: 30px;
    opacity: ${(props) => (props.$active ? '0' : '1')};
    border-radius: 10px;
    ${({ theme, $active }) => css`
        background: ${theme.colors.text};
        opacity: ${$active ? '0' : '1'};
    `}
`;

export const SpanThree = styled.div<Props>`
    transition: 0.3s all ease;
    position: relative;
    z-index: 2;
    height: 4px;
    width: 30px;
    border-radius: 10px;
    ${({ theme, $active }) => css`
        top: ${$active ? '-38px' : '-28px'};
        background: ${$active ? theme.colors.skyBlue : theme.colors.text};
        transform: rotate(${$active ? '45deg' : '0deg'});
    `}
`;

export const Card = styled.div<Props>`
    transition: 0.3s all ease;
    z-index: 1;
    position: absolute;
    right: 0;
    width: 100vw;
    height: 50vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    ${({ theme, $active }) => css`
        top: ${$active ? '0' : '-2000px'};
        background: ${theme.colors.text};
        @media screen and (max-width: ${theme.breakpoint}px) {
            height: 100vh;
        }
    `}
`;

export const CardItem = styled.div`
    color: ${(props) => props.theme.colors.background};
    font-weight: 600;
    text-transform: uppercase;
    cursor: pointer;
`;

import styled, { css } from "styled-components";

export const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh;
    max-width: 100%;
    ${({ theme }) => css`
        color: ${theme.colors.text};
        background: ${theme.colors.background};
        transition: 0.3s all ease;
    `}
`;

export const HeaderSection = styled.div`
    position: fixed;
    width: 100vw;
    overflow-x: hidden;
`;
export const MainSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 120px;
`;
export const FooterSection = styled.div``;

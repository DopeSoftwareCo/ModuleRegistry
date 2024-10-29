import { StyledBaseA } from '../../BaseStyledComponents/BaseStyled';
import { FooterContainer, FooterInformationItem, FooterInnerContainer } from './FooterStyle';
import { FaGithub } from 'react-icons/fa6';

export const Footer = () => {
    return (
        <FooterContainer>
            <FooterInnerContainer>
                <FooterInformationItem>© 2024 DSINC</FooterInformationItem>
                <FooterInformationItem>ModuleRegistry</FooterInformationItem>
                <StyledBaseA href="https://github.com/DopeSoftwareCo/ModuleRegistry">
                    <FaGithub size={'16px'} />
                </StyledBaseA>
            </FooterInnerContainer>
        </FooterContainer>
    );
};

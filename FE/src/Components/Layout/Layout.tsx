import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { FooterSection, HeaderSection, MainSection, PageContainer } from './Layout.Style';
import { MobileMenu } from '../Nav/NavBar';

export const Layout = () => {
    const loc = useLocation();

    return (
        <PageContainer>
            <HeaderSection>{loc.pathname !== '/auth' && <MobileMenu />}</HeaderSection>
            <MainSection>
                <Suspense fallback={<>loading...</>}>
                    <Outlet />
                </Suspense>
            </MainSection>
            <FooterSection>{loc.pathname !== '/auth' && <>Footer component here</>}</FooterSection>
        </PageContainer>
    );
};

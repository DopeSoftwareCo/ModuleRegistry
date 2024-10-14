import { Suspense, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FooterSection, HeaderSection, MainSection, PageContainer } from './Layout.Style';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../Redux/UserSlice';

export const Layout = () => {
    const loc = useLocation();
    const navigate = useNavigate();

    const isAuthenticated = useSelector(selectIsAuthenticated);

    return (
        <PageContainer>
            <HeaderSection>{loc.pathname !== '/auth' && <>Header component here</>}</HeaderSection>
            <MainSection>
                <Suspense fallback={<>loading...</>}>
                    <Outlet />
                </Suspense>
            </MainSection>
            <FooterSection>{loc.pathname !== '/auth' && <>Footer component here</>}</FooterSection>
        </PageContainer>
    );
};

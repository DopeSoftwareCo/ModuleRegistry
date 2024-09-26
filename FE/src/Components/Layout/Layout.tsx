import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import {
    FooterSection,
    HeaderSection,
    MainSection,
    PageContainer,
} from "./Layout.Style";

export const Layout = () => {
    return (
        <PageContainer>
            <HeaderSection>Create some nav bar</HeaderSection>
            <MainSection>
                <Suspense fallback={<>loading...</>}>
                    <Outlet />
                </Suspense>
            </MainSection>
            <FooterSection>Footer</FooterSection>
        </PageContainer>
    );
};

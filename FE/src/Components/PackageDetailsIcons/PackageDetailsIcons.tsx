import {
    FaBuilding,
    FaCheck,
    FaExclamationTriangle,
    FaExternalLinkAlt,
    FaGlobe,
    FaLock,
    FaQuestion,
    FaUserSecret,
} from 'react-icons/fa';
import { IconsContainer } from './PackageDetailsIconsStyle';

interface PackageDetailsIconsProps {
    visibility: 'secret' | 'internal' | 'public';
    safety: 'unsafe' | 'unknown' | 'vetted';
    isExternal: boolean;
}

export const PackageDetailsIconsComponent = ({
    visibility,
    safety,
    isExternal,
}: PackageDetailsIconsProps) => {
    const getVisibilityIcon = (visibility: 'secret' | 'internal' | 'public') => {
        switch (visibility) {
            case 'secret':
                return <FaUserSecret />;
            case 'internal':
                return <FaLock />;
            case 'public':
                return <FaGlobe />;
            default:
                return <>no icon</>;
        }
    };
    const getSafetyIcon = (safety: 'unsafe' | 'unknown' | 'vetted') => {
        switch (safety) {
            case 'unsafe':
                return <FaExclamationTriangle />;
            case 'unknown':
                return <FaQuestion />;
            case 'vetted':
                return <FaCheck />;
            default:
                return <>no icon</>;
        }
    };
    const getIsExternalIcon = (isExternal: boolean) => (isExternal ? <FaExternalLinkAlt /> : <FaBuilding />);
    return (
        <IconsContainer>
            {getVisibilityIcon(visibility)}
            {getSafetyIcon(safety)}
            {getIsExternalIcon(isExternal)}
        </IconsContainer>
    );
};

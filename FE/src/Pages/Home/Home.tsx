import { StyledBasePageContiner } from '../../BaseStyledComponents/BaseStyled';
import { PackagesComponent } from '../../Components/PackagesComponent/PackagesComponent';

const Home = () => {
    //should probably have all packages here since the IDs are used in other requests... users can use the IDs from here to use on other pages
    return (
        <StyledBasePageContiner>
            <PackagesComponent />
        </StyledBasePageContiner>
    );
};

export default Home;

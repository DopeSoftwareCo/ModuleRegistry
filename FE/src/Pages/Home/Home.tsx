import { StyledBaseTextInput } from '../../BaseStyledComponents/BaseStyled';
import useToggle from '../../Hooks/Example/example';
import { Example, HomeButton } from './Home.style';

const Home = () => {
    const [isVisible, toggleVisibility] = useToggle(false);
    return (
        <>
            <>home</>
            <HomeButton onClick={toggleVisibility}>Click me</HomeButton>
            {isVisible && <Example>hi</Example>}
            <StyledBaseTextInput aria-label="username" />
        </>
    );
};

export default Home;

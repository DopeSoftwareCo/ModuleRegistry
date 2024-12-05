import {
    NavContainer,
    IconTextMoonContainer,
    SpanOne,
    SpanThree,
    SpanTwo,
    BurgerCheckHolder,
    FakeCheckBox,
    Card,
    CardItem,
    NameText,
} from './NavStyled';
import { useEffect, useRef, useState } from 'react';
import { MoonIcon } from './MoonIcon';
import { useNavigate } from 'react-router-dom';
import routes from '../../Routing/routes';

const scrollables: {
    label: string;
    id: string;
}[] = [];

export const MobileMenu = () => {
    const [clicked, setClicked] = useState<boolean>(false);
    const [translateNavBar, setTranslateNavBar] = useState<boolean>(false);
    const previousScrollValue = useRef<number>(window.scrollY);
    const navigate = useNavigate();

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    const navigateTo = (path: string) => {
        console.log('navigating to', path);
        navigate(path);
    };

    const handleScroll = () => {
        setTranslateNavBar(window.scrollY > previousScrollValue.current);
        if (
            window.scrollY > previousScrollValue.current &&
            window.scrollY - previousScrollValue.current > 20
        ) {
            setTranslateNavBar(true);
        } else if (
            window.scrollY <= previousScrollValue.current &&
            previousScrollValue.current - window.scrollY > 20
        ) {
            setTranslateNavBar(false);
        }
        previousScrollValue.current = window.scrollY;
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <NavContainer $show={translateNavBar}>
            <IconTextMoonContainer>
                <NameText>MR</NameText>
                <MoonIcon />
            </IconTextMoonContainer>
            <BurgerCheckHolder>
                <FakeCheckBox type="checkbox" onClick={() => setClicked(!clicked)} $active={clicked} />
                <SpanOne $active={clicked} />
                <SpanTwo $active={clicked} />
                <SpanThree $active={clicked} />
            </BurgerCheckHolder>
            <Card $active={clicked}>
                {routes
                    .filter((route) => route.label !== 'none')
                    .map((option, idx) => (
                        <CardItem
                            key={idx}
                            onClick={() => {
                                setClicked(!clicked);
                                navigateTo(option.path);
                            }}
                            aria-label={option.label}
                        >
                            {option.label}
                        </CardItem>
                    ))}
                {scrollables.map((item, idx) => (
                    <CardItem
                        key={idx}
                        onClick={() => {
                            setClicked(!clicked);
                            scrollTo(item.id);
                        }}
                        aria-label={item.label}
                    >
                        {item.label}
                    </CardItem>
                ))}
            </Card>
        </NavContainer>
    );
};

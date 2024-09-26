import { useRouteError } from "react-router-dom";

export const FourOHFour = () => {
    const error = useRouteError();
    return (
        <>
            <>An error has occured!</>
            <>{error}</>
        </>
    );
};

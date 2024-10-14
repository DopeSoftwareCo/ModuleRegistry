import { useState } from 'react';
import { StyledBaseCard } from '../../BaseStyledComponents/BaseStyled';
import { Form, LoginField, LoginLabel, PasswordField, SubmitButton } from './LoginStyle';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const requestToken = () => {
        console.log(username, password);
    };

    const authenticateUser = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        requestToken();
    };

    return (
        <StyledBaseCard aria-label="login-card">
            <Form aria-label="login-card-container">
                <LoginLabel aria-label="login-card-label">Module Registry</LoginLabel>
                <LoginField
                    placeholder="username"
                    aria-label="username-input-box"
                    onChange={(e) => setUsername(e.target.value)}
                />
                <PasswordField
                    placeholder="password"
                    aria-label="password-input-box"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <SubmitButton onSubmit={authenticateUser}>Login</SubmitButton>
            </Form>
        </StyledBaseCard>
    );
};

export default Login;

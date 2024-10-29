import { useState } from 'react';
import { Form, LoginField, LoginLabel, PasswordField, SubmitButton, LoginCard } from './LoginStyle';
import { authenticateUserRequest } from './LoginRequest';
import { decodeAndSetToken } from './Token';
import { useNavigate } from 'react-router-dom';
import { ErrorDisplay } from '../../Components/ErrorDisplay/ErrorDisplay';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState<string | undefined>(undefined);
    const navigate = useNavigate();

    const requestToken = async (username: string, password: string) => {
        const responseText = await authenticateUserRequest(username, password);
        if (responseText) {
            if (responseText.includes('Bearer')) {
                decodeAndSetToken(responseText);
                navigate('/home');
            } else {
                setErr(responseText.length < 200 ? responseText : 'An unknown error occured!');
            }
        }
    };

    const processFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await requestToken(username, password);
    };

    return (
        <LoginCard aria-label="login-card">
            <Form aria-label="login-card-container" onSubmit={(e) => processFormSubmit(e)}>
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
                <SubmitButton type="submit">Login</SubmitButton>
                <ErrorDisplay err={err} setErr={setErr} />
            </Form>
        </LoginCard>
    );
};

export default Login;

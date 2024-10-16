import { useEffect, useState } from 'react';
import {
    ErrorMessage,
    Form,
    LoginField,
    LoginLabel,
    PasswordField,
    SubmitButton,
    LoginCard,
} from './LoginStyle';
import { authenticateUserRequest } from './LoginRequest';
import { decodeAndSetToken } from './Token';
import { useNavigate } from 'react-router-dom';

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

    useEffect(() => {
        let timeout: number | null = null;
        if (err) {
            timeout = setTimeout(() => {
                setErr(undefined);
            }, 5000);
        }
        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    }, [err]);

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
                <ErrorMessage>{err && err}</ErrorMessage>
            </Form>
        </LoginCard>
    );
};

export default Login;

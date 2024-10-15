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
import { GeneralConfig } from '../../Config/config';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState<string | undefined>(undefined);

    const requestToken = async (username: string, password: string) => {
        const response = await fetch(`${GeneralConfig.BACKEND_URL}authenticate`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                User: {
                    name: username,
                    isAdmin: true,
                },
                Secret: {
                    password: password,
                },
            }),
        });
        const responseText = await response.text();
        if (responseText) {
            if (responseText.includes('bearer')) {
                //set the token
                sessionStorage.setItem('token', responseText);
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

    const authenticateUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await requestToken(username, password);
    };

    return (
        <LoginCard aria-label="login-card">
            <Form aria-label="login-card-container" onSubmit={(e) => authenticateUser(e)}>
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

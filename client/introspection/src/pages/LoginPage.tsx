import { Button, Card, Input, Label, Title1, useId } from '@fluentui/react-components';
import { FormEvent, useEffect, useState } from 'react';
import {useIsAuthenticated, useSignIn} from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';

import styles from './LoginPage.module.css';


export default function LoginPage() {
  const emailId = useId("email");
  const passwordId = useId("password");
  const signIn = useSignIn();
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');
    }
  }, [isAuthenticated]);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    // TODO fix hardcoded base url
    try {
      const data = await fetch('http://127.0.0.1:3000/api/login', { 
        headers: {
          "Content-Type": "application/json"
        },
        method: 'POST', 
        body: JSON.stringify(formData)
      });
      const res = await data.json();

      // TODO handle login errors
      if (res.error) {
        return;
      }

      signIn({
        token: res.token,
        expiresIn: 3600,
        tokenType: 'Bearer',
        authState: { email: formData.email}
      });

    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.cardContainer}>
      <Card className={styles.card}>
        <Title1 align="center">Log In</Title1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <Input name="email" className={styles.formItem} id={emailId} type="email" placeholder="Email" onChange={handleChange} /> 
          <br />
          <Input name="password" className={styles.formItem} id={passwordId} type="password" placeholder="Password" onChange={handleChange} />
          <br />
          <Button id={styles.submit} type="submit">Log in</Button>
        </form>
      </Card>
    </div>
  );
}
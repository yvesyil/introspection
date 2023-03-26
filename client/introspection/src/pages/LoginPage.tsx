import { Button, Card, Input, Label, Title1, useId } from '@fluentui/react-components';
import { FormEvent } from 'react';
import {useSignIn} from 'react-auth-kit';

import styles from './LoginPage.module.css';


export default function LoginPage() {
  const usernameId = useId("username");
  const passwordId = useId("password");

  const signIn = useSignIn();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className={styles.cardContainer}>
      <Card className={styles.card}>
        <Title1 align="center">Log In</Title1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <Input className={styles.formItem} id={usernameId} type="text" placeholder="Username"/> 
          <br />
          <Input className={styles.formItem} id={passwordId} type="password" placeholder="Password"/>
          <br />
          <Button id={styles.submit} type="submit">Log in</Button>
        </form>
      </Card>
    </div>
  );
}
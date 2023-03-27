import { Button, Select, useId } from "@fluentui/react-components";
import { useIsAuthenticated, useSignOut } from "react-auth-kit";
import { Link } from "react-router-dom";

import styles from './Nav.module.css';

export function Nav({ height }: { height: number }) {
  const isAuthenticated = useIsAuthenticated();
  const signout = useSignOut();
  const selectId = useId();

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: `${height}px`,
      padding: '0 10px'
    }}>
      <Button className={styles.button}>Compile</Button>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        width: '300px',
        justifyContent: 'space-between',
      }}>
        <label htmlFor={selectId}>Compiler</label>
        <Select id={selectId}>
          <option>clang</option>
          <option>gcc</option>
        </Select>
        { isAuthenticated() ? (
            <Button className={styles.button} onClick={signout}>Logout</Button>
          ) : (
            <Link className={styles.link} to={`/login`}>
              <Button className={styles.button}>Login</Button>
            </Link>
          )
        }
      </div>
    </div>
  );
}
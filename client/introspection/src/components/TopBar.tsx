import { Button, Select, useId } from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { useIsAuthenticated, useSignOut } from "react-auth-kit";
import { Link } from "react-router-dom";
import { CompilerObject, getCompilers } from "../api-calls/compiler-service";

import styles from './TopBar.module.css';


export default function TopBar({ height }: { height: number }) {
  const isAuthenticated = useIsAuthenticated();
  const signout = useSignOut();
  const selectId = useId();

  const [compilers, setCompilers] = useState([] as CompilerObject[]);

  const updateCompilers = async () => {
    setCompilers(await getCompilers());
  }

  const handleCompile = () => {
    // TODO get compiler info
    // TODO make api call to /compile
    // TODO update the result
  }

  useEffect(() => {
    updateCompilers();
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: `${height}px`,
      padding: '0 10px'
    }}>
      <Button className={styles.button} onClick={handleCompile}>Compile</Button>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        width: '300px',
        justifyContent: 'space-between',
      }}>
        <label htmlFor={selectId}>Compiler</label>
        <Select id={selectId}>
          {
            compilers.map((compiler: CompilerObject, i) => <option key={i}>{compiler.name} {compiler.version}</option>)
          }
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
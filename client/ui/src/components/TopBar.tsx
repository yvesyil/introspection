import { Button, Select, useId } from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { useAuthHeader, useIsAuthenticated, useSignOut } from "react-auth-kit";
import { Link } from "react-router-dom";
import { CompilerObject, OutputObject, compileFile, getCompilers } from "../api-calls/compiler-service";

import styles from './TopBar.module.css';
import WindowConfig from "../interfaces/window";
import { FileObject } from "../api-calls/file-service";


export default function TopBar({ config, openFile, setOutput }: {
   config: WindowConfig,
   openFile: FileObject,
   setOutput: (output: OutputObject) => void
  }) {

  const isAuthenticated = useIsAuthenticated();
  const authHeader = useAuthHeader();
  const signout = useSignOut();
  const selectId = useId();

  const [compilers, setCompilers] = useState([] as CompilerObject[]);

  const updateCompilers = async () => {
    setCompilers(await getCompilers());
  }

  const handleCompile = async () => {
    // TODO get compiler info
    // TODO make api call to /compile
    const output = await compileFile(openFile, authHeader());
    // TODO update the result
    setOutput(output);
  }

  useEffect(() => {
    updateCompilers();
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: `${config.height}px`,
      width: `${config.width}px`,
      boxSizing: 'border-box',
      padding: '0 20px',
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
import { Button, Select, useId } from "@fluentui/react-components";
import { Link } from "react-router-dom";

import styles from './Nav.module.css';

export function Nav({ height }: { height: number }) {

  let selectId = useId();

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
        <Link className={styles.link} to={`/login`}>
          <Button className={styles.button}>Login</Button>
        </Link>
      </div>
    </div>
  );
}
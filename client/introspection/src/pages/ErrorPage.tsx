import { Display } from "@fluentui/react-components";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError() as Error;
  console.error(error);

  if (isRouteErrorResponse(error)) {
    return (
      <>
        <h1>Oops!</h1>
        <h2>{error.status}</h2>
        <p>{error.statusText}</p>
        {error.data?.message && <p>{error.data.message}</p>}
      </>
    );
  } else {
    return <Display>Oops</Display>;
  }
}
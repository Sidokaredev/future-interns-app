import { Link } from "react-router-dom";

export default function Auth() {
  return (
    <>
      This is Auth Page
      <Link to={'/accounts/create'}>
        <p>Do haven't an account? Sign Up then.</p>
      </Link>
    </>
  )
}
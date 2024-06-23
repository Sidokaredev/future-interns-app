import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <>
      This is SignUp Page
      <br />
      <Link to={"/accounts/auth"} >Go to Login instead</Link>
      <br />
      <Link to={"/"} style={{ color: 'red' }}>Homepage</Link>
    </>
  )
}
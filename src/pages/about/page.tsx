import { Link } from "react-router-dom"

export default function About() {
  // const { data }: any = useLoaderData();
  return (
    <div className="about-page">
      About Page
      {/* {`Loader -> ${data}`} */}
      <Link to={'/home'}>Go Home</Link>
      <Link to={'/accounts/auth'}>Go Auth</Link>
      <a href="/accounts/auth">Auth</a>
    </div>
  )
}
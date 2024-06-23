import { useParams } from "react-router-dom"

export default function EmailIdentity() {
  const { email } = useParams();
  return (
    <>
      Email Identity Page by Dynamic Route
      <span style={{ fontWeight: 'bolder' }}>{email}</span>
    </>
  )
}
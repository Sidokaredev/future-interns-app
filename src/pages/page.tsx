// import React from "react";
import { useLoaderData } from "react-router-dom"
import NavigationHeader from "../components/Organisms/NavigationHeader";
import { Box, Container } from "@mui/material";
import Footer from "../components/Organisms/Footer";
import HomeContent1 from "../components/Organisms/HomeContent1";
import HomeContent2 from "../components/Organisms/HomeContent2";

// const fetchUsers = async () => {
//   const request = await fetch('https://jsonplaceholder.typicode.com/comments', {
//     method: 'GET',
//     headers: {
//       "Content-Type": "application/json"
//     }
//   });

//   const response = await request.json();
//   return response;
// }

// const UsersList =  React.lazy(() => fetchUsers().then((data) => {
//   return {
//     default: () => {
//       return (
//         <>
//           {data.map((comment: any) => (
//             <div key={comment.id} style={{ padding: '1em', border: '1px solid black', borderRadius: '0.3em', marginTop: '1rem' }}>
//               <h5 style={{ color: 'blue' }}>{comment.email}</h5>
//               <p style={{ fontSize: 'small' }}>{comment.body}</p>
//             </div>
//           ))}
//         </>
//       )
//     }
//   }
// }))

{/* <Suspense fallback={<><br /><h4 style={{ color: 'red' }}>Fetching users data...</h4></>}>
  <div
    style={
      {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem'
      }
    }>
    <UsersList />
  </div>
</Suspense> */}
export default function Homepage() {
  const users = useLoaderData() as any[]
  console.info("users \t:", users)
  // const prevent = useMediaQuery(`(min-width: 768px)`)
  return (
    <Container
      disableGutters
      maxWidth='xl'
      >
        {/* {!prevent && <h1 className="">PLEASE USE DESKTOP INSTEAD</h1>} */}
        <NavigationHeader />
        {/* Section 1 */}
        <Box
          sx={{
            backgroundImage: `url('/backgrounds/Final-AnimatedShape-1.svg')`,
            height: '695px',
            backgroundSize: 'cover',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <HomeContent1 />
        </Box>
        {/* Section 2 */}
        <Box
          sx={{
            // height: '695px'
          }}
        >
          <HomeContent2 />
        </Box>
        {/* Footer */}
        <Footer />
    </Container>
  )
}
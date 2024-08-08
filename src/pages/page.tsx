// import React from "react";
import { useLoaderData } from "react-router-dom"
import NavigationHeader from "../components/Organisms/NavigationHeader"
import { Box, useMediaQuery, useTheme } from "@mui/material"
import Footer from "../components/Organisms/Footer"
import HomeSection1 from "../components/Organisms/Home/Section1"
import HomeSection2 from "../components/Organisms/Home/Section2"
import ScreenWidthError from "../components/Molecules/Errors/ScreenWidth/ScreenWitdthError"

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

  const theme = useTheme()
  const IsDesktopScreen = useMediaQuery(theme.breakpoints.up('lg'))
  // const IsDesktopScreen = false
  return (
    <>
      {/* check user MediaScreen width (1200px required) */}
      <Box
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
            <HomeSection1 />
          </Box>
          {/* Section 2 */}
          <Box
            sx={{
              // height: '695px'
            }}
          >
            <HomeSection2 />
          </Box>
          {/* Footer */}
          <Footer />
      </Box>
      {/* {IsDesktopScreen ? (
      ) : (
        <ScreenWidthError />
      )} */}
    </>
  )
}
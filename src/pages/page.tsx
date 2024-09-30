// import React from "react";
import { useLoaderData } from "react-router-dom";
import { Box } from "@mui/material";
import HomeSection1 from "../components/Organisms/Home/Section1";
import HomeSection2 from "../components/Organisms/Home/Section2";
import BaseLayout from "../components/Templates/BaseLayout";

// const fetchUsers = async () => {
//   const request = await fetch("https://jsonplaceholder.typicode.com/comments", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   const response = await request.json();
//   return response;
// };

// const UsersList = React.lazy(() =>
//   fetchUsers().then((data) => {
//     return {
//       default: () => {
//         return (
//           <>
//             {data.map((comment: any) => (
//               <div
//                 key={comment.id}
//                 style={{
//                   padding: "1em",
//                   border: "1px solid black",
//                   borderRadius: "0.3em",
//                   marginTop: "1rem",
//                 }}
//               >
//                 <h5 style={{ color: "blue" }}>{comment.email}</h5>
//                 <p style={{ fontSize: "small" }}>{comment.body}</p>
//               </div>
//             ))}
//           </>
//         );
//       },
//     };
//   })
// );

{
  /* <Suspense fallback={<><br /><h4 style={{ color: 'red' }}>Fetching users data...</h4></>}>
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
</Suspense> */
}
export default function Homepage() {
  const users = useLoaderData() as any[];
  console.info("users \t:", users);
  // const UsersList = React.lazy(() =>
  //   fetchUsers()
  //     .then((data) => {
  //       return {
  //         default: () => {
  //           return (
  //             <>
  //               {data.map((comment: any) => (
  //                 <div
  //                   key={comment.id}
  //                   style={{
  //                     padding: "1em",
  //                     border: "1px solid black",
  //                     borderRadius: "0.3em",
  //                     marginTop: "1rem",
  //                   }}
  //                 >
  //                   <h5 style={{ color: "blue" }}>{comment.email}</h5>
  //                   <p style={{ fontSize: "small" }}>{comment.body}</p>
  //                 </div>
  //               ))}
  //             </>
  //           );
  //         },
  //       };
  //     })
  //     .catch((err) => {
  //       return {
  //         default: () => {
  //           return <>{err}</>;
  //         },
  //       };
  //     })
  // );

  return (
    <BaseLayout>
      {/* Section 1 */}
      <Box
        sx={{
          backgroundImage: `url('/future-interns-app/backgrounds/Final-AnimatedShape-1.svg')`,
          height: "695px",
          backgroundSize: "cover",
          display: "flex",
          alignItems: "center",
        }}
      >
        <HomeSection1 />
      </Box>
      {/* Section 2 */}
      <Box component={"div"}>
        <HomeSection2 />
      </Box>
    </BaseLayout>
  );
}

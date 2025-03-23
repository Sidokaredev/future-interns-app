import React, { Suspense } from "react";

const fetchUsers = async () => {
  const request = await fetch("https://jsonplaceholder.typicode.com/comments", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response = await request.json();
  return response;
};


export const UsersList = React.lazy(() =>
  fetchUsers().then((data) => {
    return {
      default: () => {
        return (
          <>
            {data.map((comment: any) => (
              <div
                key={comment.id}
                style={{
                  padding: "1em",
                  border: "1px solid black",
                  borderRadius: "0.3em",
                  marginTop: "1rem",
                }}
              >
                <h5 style={{ color: "blue" }}>{comment.email}</h5>
                <p style={{ fontSize: "small" }}>{comment.body}</p>
              </div>
            ))}
          </>
        );
      },
    };
  })
);

export default function FetchingWithLazyDraft() {
  const UsersList = React.lazy(() =>
    fetchUsers()
      .then((data) => {
        return {
          default: () => {
            return (
              <>
                {data.map((comment: any) => (
                  <div
                    key={comment.id}
                    style={{
                      padding: "1em",
                      border: "1px solid black",
                      borderRadius: "0.3em",
                      marginTop: "1rem",
                    }}
                  >
                    <h5 style={{ color: "blue" }}>{comment.email}</h5>
                    <p style={{ fontSize: "small" }}>{comment.body}</p>
                  </div>
                ))}
              </>
            );
          },
        };
      })
      .catch((err) => {
        return {
          default: () => {
            return <>{err}</>;
          },
        };
      })
  );
  return (
    <div>
      Here all the sample of fetching load data in a lazy way.
      <Suspense fallback={<><br /><h4 style={{ color: 'red' }}>Fetching users data...</h4></>}>
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
      </Suspense>
    </div>
  )
}
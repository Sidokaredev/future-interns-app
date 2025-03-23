// import React from "react";
// import { useLoaderData } from "react-router-dom";
import { Box } from "@mui/material";
import HomeSection1 from "../components/Organisms/Home/Section1";
import HomeSection2 from "../components/Organisms/Home/Section2";
import BaseLayout from "../components/Templates/BaseLayout";
import { useState } from "react";

// type Log = {
//   cache_hit: number;
//   cache_miss: number;
//   response_time: number;
//   memory_usage: number;
//   cpu_usage: number;
//   resource_utilization: number;
// }

export default function Homepage() {
  // const users = useLoaderData() as any[];
  /* state */
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <BaseLayout>
      {/* Section 1 */}
      <Box
        sx={{
          backgroundImage:
            "url(/future-interns-app/backgrounds/Final-AnimatedShape-1.svg) !important",
          backgroundSize: "cover",
          height: "695px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <HomeSection1 setSearchQuery={setSearchQuery} />
      </Box>
      {/* Section 2 */}
      <Box component={"div"}>
        <HomeSection2 searchQuery={searchQuery} />
      </Box>
    </BaseLayout>
  );
}

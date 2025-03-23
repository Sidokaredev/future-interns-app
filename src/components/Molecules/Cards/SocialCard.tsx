import { AddRounded, EditRounded } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

export type SocialCardProps = {
  id: number;
  name: string;
  url: string;
  icon_image_path: string
};

export default function SocialCard({
  socialItems,
}: {
  socialItems: SocialCardProps[];
}) {
  return (
    <Box
      component={"div"}
      sx={{
        marginY: "1em",
      }}
    >
      <Box component={"div"}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 550,
            color: grey[600],
            textAlign: "center",
          }}
        >
          Social
        </Typography>
        <Box component={"div"}
          sx={{
            display: "flex",
          }}
        >
          <IconButton size="small">
            <AddRounded fontSize="small" />
          </IconButton>
          <IconButton size="small">
            <EditRounded fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      <Box
        component={"div"}
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "0 0.5em",
        }}
      >
        {socialItems.map((item, index) => (
          <IconButton
            key={index}
            size="small"
            sx={{
              borderRadius: "0.3em",
              border: `0.1em solid ${grey[400]}`,
            }}
            onClick={() => window.open(item.url, "_blank")}
          >
            <Box component={"img"}
              src={`${item.icon_image_path}`}
              width={25}
              height={25}
              sx={{
                backgroundSize: "cover",
                objectFit: "scale-down"
              }}
            />
          </IconButton>
        ))}
      </Box>
    </Box>
  );
}

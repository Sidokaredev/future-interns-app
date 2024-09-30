import { Settings } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import SimpleEmphasis from "../Texts/SimpleEmphasis";

export default function CandidateProfile() {
  return (
    <Stack direction={"column"} spacing={3}>
      {/* candidate.profile */}
      <Box component={"div"}>
        <Box
          component={"div"} // img
          // alt="candidate-cover"
          // src="https://placehold.co/600x400.kl"
          sx={{
            width: "100%",
            height: { xs: "10em", md: "15em" },
            borderRadius: "0.5em",
            backgroundColor: "grey",
            backgroundSize: "cover",
          }}
        />
        <Box
          component={"div"}
          sx={{
            marginTop: { xs: "-10%", sm: "-7%", md: "-5%" },
            display: "flex",
            alignItems: "end",
          }}
        >
          <Avatar
            alt="candidate-profile"
            src="/broken.jpg"
            sx={{
              width: "6em",
              height: "6em",
              border: "0.2em solid white",
              marginX: "1em",
            }}
          />
          <Box
            component={"div"}
            sx={{
              flexGrow: 1,
            }}
          >
            <Typography component={"div"} variant="subtitle1">
              Fatkhur Rozak
            </Typography>
            <Typography component={"div"} variant="caption">
              Front-End Developer (Expertise)
            </Typography>
          </Box>
          <IconButton>
            <Settings fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      {/* candidate.summary */}
      <Box component={"div"}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 550,
            color: grey[800],
          }}
        >
          About Me
        </Typography>
        <Typography variant="body1">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione hic
          culpa velit, repellat fugit molestiae, sint temporibus, ipsam nisi
          voluptas quo impedit! Adipisci ipsa nam illum, quam laborum iusto
          sequi? Voluptatum tempore quo nostrum nisi. Rem sunt distinctio minima
          odit commodi iste, veritatis atque labore sapiente quia est sit,
          nostrum similique, exercitationem nisi cum molestiae quidem asperiores
          eveniet aliquid repudiandae?
        </Typography>
      </Box>
      {/* candidate.skills */}
      <Box component={"div"}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 550,
            color: grey[800],
            marginBottom: "0.5em",
          }}
        >
          Skills
        </Typography>
        <Box component={"div"}>
          {["Javascript", "Ms. SQL Server", "Terraform"].map((skill, index) => (
            <Chip key={index} label={skill} sx={{ marginRight: "0.5em" }} />
          ))}
        </Box>
      </Box>
      {/* candidate.experiences */}
      <Box component={"div"}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 550,
            color: grey[800],
            marginBottom: "1em",
          }}
        >
          Experiences
        </Typography>
        <Box component={"div"} className="experience-item">
          <Box
            component={"div"}
            className="experience-item-company"
            sx={{
              display: "flex",
              alignItems: "start",
            }}
          >
            <Avatar
              alt="Company"
              src="broken.jpg"
              sx={{
                width: "3.5em",
                height: "3.5em",
              }}
            />
            <Box
              component={"div"}
              sx={{
                marginLeft: "1em",
              }}
            >
              <Typography variant="subtitle1">Backend Developer</Typography>
              <Typography variant="caption">
                <SimpleEmphasis text={"Sidokaredev"} textColor="#06816d" />
                <Divider
                  component={"span"}
                  orientation="vertical"
                  sx={{
                    marginX: "1em",
                    borderColor: "#838383",
                  }}
                />
                Indonesia
              </Typography>
              <Box
                component={"div"}
                sx={{
                  marginY: "1em",
                }}
              >
                <Typography variant="body1">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Laboriosam, placeat? Rerum molestias est animi fugit eveniet
                  praesentium inventore fugiat vel, voluptatem consectetur iste
                  quaerat, facere ad dolores quibusdam quia fuga. Quis dolorem
                  impedit amet eos officia sequi maxime, eius sapiente animi
                  repudiandae natus deserunt, vero architecto maiores laboriosam
                  optio? Labore vel voluptate cumque pariatur dicta praesentium
                  quidem at magnam perspiciatis.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Stack>
  );
}

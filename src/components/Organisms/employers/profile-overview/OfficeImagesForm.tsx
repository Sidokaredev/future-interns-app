import { AddRounded, CloseRounded } from "@mui/icons-material";
import { Box, Button, CircularProgress, IconButton, InputBase, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import React, { ChangeEvent, useState } from "react";
import { GetSession } from "../../../../pages/global-helpers";
import RequestAPI from "../../../../services/api/request";

export default function OfficeImagesForm({
  setAlert,
  setDataAction,
  onCloseDialog,
}: {
  setAlert: React.Dispatch<React.SetStateAction<{ show: boolean, message: string }>>;
  setDataAction: React.Dispatch<React.SetStateAction<boolean>>;
  onCloseDialog: (key: string) => void;
}) {
  /* state */
  const [officeImages, setOfficeImages] = useState<{ filename: string, src: string }[]>([]);
  const [officeImagesFile, setOfficeImagesFile] = useState<File[]>([]);
  const [hovered, setHovered] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(false);

  /* onSubmit */
  const onSubmit = () => async () => {
    setLoading(true);
    const token = GetSession("auth");
    if (officeImagesFile.length === 0) {
      setLoading(false);
      return setAlert({ show: true, message: "you have to choose an image, at least." })
    };
    const formDataBody = new FormData();
    officeImagesFile.forEach(image => {
      formDataBody.append("office_images", image);
    })
    const [success, fail] = await RequestAPI.Send<any>(
      "/api/v1/employers/office-images/",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token
        },
        body: formDataBody,
      }
    );
    if (fail) {
      setLoading(false);
      return setAlert({ show: true, message: fail.message });
    };
    if (success) {
      setLoading(false);
      onCloseDialog("office-images");
      setDataAction(prev => !prev);
      return setAlert({ show: true, message: success["message"] });
    };
  };
  return (
    <Box component={"div"}>
      <Box component={"div"}>
        <Typography component={"p"} variant="subtitle1"
          sx={{
            marginBottom: "1em",
            fontWeight: 550,
            color: grey[600],
          }}
        >
          Office Images
        </Typography>
      </Box>
      <Box component={"div"} className="office_images_container"
        sx={{
          display: "flex",
          gap: "0.5em",
          flexWrap: "wrap",
        }}
      >
        {/* office image item */}
        {officeImages.map((image, index) => {
          const imageKey = `item${index}`
          return (
            <Box
              key={index}
              component={"div"}
              onMouseEnter={() => setHovered(prev => ({
                ...prev,
                [imageKey]: true
              }))}
              onMouseLeave={() => setHovered(prev => ({
                ...prev,
                [imageKey]: false
              }))}
              sx={{
                width: 150,
                height: 150,
                position: "relative"
              }}
            >
              <Box component={"img"}
                width={150}
                height={150}
                src={image.src}
                sx={{
                  objectFit: "cover"
                }}
              />
              {hovered[imageKey] && (
                <Box component={"div"}
                  sx={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "start",
                    backgroundColor: "white",
                    opacity: "40%"
                  }}
                >
                  <IconButton size="small"
                    onClick={() => {
                      setOfficeImages(prev => {
                        prev.splice(index, 1)
                        return prev
                      })
                    }}
                  >
                    <CloseRounded fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          )
        })}
        {/* add button */}
        <Box component={"div"}
          sx={{
            width: 150,
            height: 150,
            border: "1px dashed " + grey[300],
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton component="label"
            htmlFor="office_image"
          >
            <AddRounded sx={{ color: grey[600] }} />
            <InputBase
              id="office_image"
              type="file"
              name="office_image"
              slotProps={{
                input: {
                  accept: "image/*"
                }
              }}
              sx={{
                height: '0px',
                width: '0px',
                opacity: 0
              }}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                const file = event.target.files?.[0]
                if (file) {
                  if (file.size > 1048576) {
                    return setAlert({ show: true, message: "your office image must less than 1MB" });
                  }

                  const fileURL = URL.createObjectURL(file);
                  setOfficeImagesFile(prev => ([...prev, file]));
                  return setOfficeImages(prev => ([...prev, { filename: file.name, src: fileURL }]));
                }
              }}
            />
          </IconButton>
        </Box>
      </Box>
      <Box component={"div"}
        sx={{
          display: "flex",
          justifyContent: "end",
        }}
      >
        <Button
          variant="contained"
          size="small"
          disabled={loading}
          sx={{
            minWidth: "10em"
          }}
          onClick={onSubmit()}
        >
          {loading ? (
            <CircularProgress size={20} />
          ) : "Submit"}
        </Button>
      </Box>
    </Box>
  )
}
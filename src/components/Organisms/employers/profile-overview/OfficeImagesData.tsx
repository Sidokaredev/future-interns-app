import { Box, Button, CircularProgress, Dialog, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { OfficeImageType } from "../../../../pages/employers/types";
import { GetSession } from "../../../../pages/global-helpers";
import RequestAPI from "../../../../services/api/request";
import { grey, red } from "@mui/material/colors";
import { AddRounded, DeleteRounded, EditRounded } from "@mui/icons-material";
import SimpleEmphasis from "../../../Molecules/Texts/SimpleEmphasis";
import OfficeImagesForm from "./OfficeImagesForm";
import { HOST } from "../../../../pages/administrators/performance/[id]/constants";

export default function OfficeImagesData({
  setAlert,
  openDialog,
  handleOpenDialog,
  onCloseDialog
}: {
  setAlert: React.Dispatch<React.SetStateAction<{ show: boolean; message: string }>>;
  openDialog: Record<string, boolean>;
  handleOpenDialog: (key: string) => void;
  onCloseDialog: (key: string) => void;
}) {
  /* state */
  const [officeImages, setOfficeImages] = useState<OfficeImageType[]>([]);
  const [imageToDelete, setImageToDelete] = useState<OfficeImageType | null>(null);
  const [onEdit, setOnEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataAction, setDataAction] = useState<boolean>(false);
  const [hovered, setHovered] = useState<Record<string, boolean>>({});

  /* helpers */
  const imageResizer = (length: number, index: number): number => {
    if (length % 3 == 0) {
      const pattern = [12, 6, 6];
      const indexValue = index % pattern.length;
      return pattern[indexValue];
    } else if (length % 2 == 0) {
      return 6;
    } else {
      if (length - 1 === index) {
        return 12;
      }
      return 6;
    }
  };
  const hoverEnter = (key: string) => () => {
    if (!onEdit) {
      return;
    }
    setHovered(prev => ({
      ...prev,
      [key]: true,
    }));
  };
  const hoverLeave = (key: string) => () => {
    if (!onEdit) {
      return;
    }
    setHovered(prev => ({
      ...prev,
      [key]: false,
    }));
  };

  /* onSubmit */
  /* onDelete */
  const onDelete = async (imagePath: string) => {
    setLoading(true);
    const pathSplitted = imagePath.split('/');

    const token = GetSession("auth");
    const endpoint = `/api/v1/employers/office-images/${pathSplitted[pathSplitted.length - 1]}`;
    const [success, fail] = await RequestAPI.Send<string>(
      endpoint,
      {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + token,
        }
      }
    );
    if (fail) {
      setLoading(false);
      return setAlert({ show: true, message: fail.message });
    };
    if (success) {
      setLoading(false);
      onCloseDialog("delete-office-images");
      setDataAction(prev => !prev);
      return setAlert({ show: true, message: success });
    };
  };

  /* fetching */
  useEffect(() => {
    const token = GetSession("auth");
    (async () => {
      const [data, fail] = await RequestAPI.Send<OfficeImageType[]>(
        "/api/v1/employers/office-images/",
        {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token
          }
        }
      );
      if (fail) {
        return setAlert({ show: true, message: fail.message });
      };
      if (data) {
        return setOfficeImages(data);
      }
    })();
  }, [dataAction])
  return (
    <Box component={"div"}
    >
      <Box component={"div"}
        sx={{
          marginTop: "1.5em",
          marginBottom: "0.8em",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography component={"p"} variant="subtitle1"
          sx={{
            fontWeight: 550,
            color: grey[800]
          }}
        >
          Office Images
        </Typography>
        <Box component={"div"}>
          {!onEdit && (
            <>
              <IconButton size="small"
                onClick={() => {
                  if (officeImages.length === 9) {
                    return setAlert({ show: true, message: "Maximum of 9 images, cannot add more office images!" });
                  }
                  handleOpenDialog("office-images");
                }}
              >
                <AddRounded fontSize="small" />
              </IconButton>
              <IconButton size="small"
                onClick={() => {
                  setOnEdit(true);
                }}
              >
                <EditRounded fontSize="small" />
              </IconButton>
            </>
          )}
          {onEdit && (
            <Button
              variant="text"
              color="error"
              size="small"
              onClick={() => setOnEdit(false)}
            >
              cancel
            </Button>
          )}
        </Box>
      </Box>
      <Grid container
        columnSpacing={1}
        rowSpacing={1}
      >
        {officeImages.map((image, index) => {
          const key = `office_images_${index}`;
          return (
            <Grid key={index} item xs={imageResizer(officeImages.length, index)}>
              <Box component={"div"}
                onMouseEnter={hoverEnter(key)}
                onMouseLeave={hoverLeave(key)}
                sx={{
                  position: "relative"
                }}
              >
                <Box component={"img"}
                  width={"100%"}
                  height={{ xs: "10em", sm: "15em", lg: "20em" }}
                  alt={image.name}
                  src={`${HOST.main}${image.image_path}`}
                  sx={{
                    objectFit: "cover",
                    borderRadius: "0.2em",
                    opacity: hovered[key] && index != 0 ? "20%" : undefined,
                  }}
                />
                {/* overlay */}
                {hovered[key] && index != 0 && (
                  <Box component={"div"}
                    sx={{
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Tooltip title="Delete image" placement="top">
                      <IconButton size="small"
                        onClick={() => {
                          setImageToDelete(image);
                          handleOpenDialog("delete-office-images");
                        }}
                      >
                        <DeleteRounded fontSize="small" sx={{ color: red[700] }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </Box>
            </Grid>
          )
        })}
      </Grid>
      {/* Office Images Form */}
      <Dialog
        open={Boolean(openDialog["office-images"])}
        onClose={() => {
          onCloseDialog("office-images");
        }}
        maxWidth={"lg"}
        PaperProps={{
          sx: {
            padding: "1em"
          }
        }}
        fullWidth
      >
        <OfficeImagesForm
          setAlert={setAlert}
          setDataAction={setDataAction}
          onCloseDialog={onCloseDialog}
        />
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(openDialog["delete-office-images"])}
        onClose={() => {
          onCloseDialog("delete-office-images");
        }}
        maxWidth="sm"
        PaperProps={{
          sx: {
            padding: "1em"
          }
        }}
        fullWidth
      >
        <Box component={"div"}>
          <Typography component={"p"} variant="body1" sx={{ color: grey[600] }}>
            Are you sure want to
            <SimpleEmphasis text={" delete "} textColor="red" />
            your Office Image {imageToDelete?.name} ?
          </Typography>
        </Box>
        <Box component={"div"} sx={{
          marginTop: 2,
          display: "flex",
          justifyContent: "end",
          columnGap: "0.5em"
        }}>
          <Button
            variant="contained"
            size="small"
            color="error"
            sx={{
              minWidth: "8em"
            }}
            disabled={loading}
            onClick={() => {
              onCloseDialog("delete-office-images")
            }}
          >
            No
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="secondary"
            sx={{
              minWidth: "8em"
            }}
            disabled={loading}
            onClick={() => {
              onDelete(imageToDelete?.image_path as string);
            }}
          >
            {loading ? (
              <CircularProgress size={20} />
            ) : "Yes"}
          </Button>
        </Box>
      </Dialog>
    </Box>
  )
}
import { Box, FormControl, FormHelperText, Grid, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { EducationFormType, SkillDataType } from "../../../../pages/candidates/types";
import RequestAPI from "../../../../services/api/request";
import { grey, red } from "@mui/material/colors";
import { AddRounded, DeleteRounded } from "@mui/icons-material";

export default function SkillsForm({
  formValue,
  setFormValue,
  errMsg
}: {
  formValue: { skill_id: number }[]
  setFormValue: React.Dispatch<React.SetStateAction<{ educations: EducationFormType, skills: { skill_id: number }[] }>>
  errMsg: { [key: number]: Record<string, string> }
}) {
  /* state */
  const [skillOption, setSkillOption] = useState<SkillDataType[]>([])
  /* event handler */
  const addMoreSkill = () => {
    setFormValue(prev => ({
      ...prev,
      skills: [...prev.skills, { skill_id: 0 }]
    }))
  }
  const deleteSkill = (index: number) => () => {
    setFormValue(prev => {
      prev.skills.splice(index, 1)
      return {
        ...prev
      }
    })
  }
  /* side-effect */
  useEffect(() => {
    (async () => {
      const [data_skills, fail_skills] = await RequestAPI.Send<SkillDataType[]>("/api/v1/public/skills/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      if (fail_skills !== undefined) {
        alert(fail_skills.message)
        return
      }

      if (data_skills !== undefined) {
        setSkillOption(data_skills)
        return
      }
    })()
  }, [])
  return (
    <Box component={"div"}>
      <Typography
        component={"p"}
        variant="subtitle1"
        sx={{
          marginBottom: "0.5em",
          fontWeight: 550,
          color: grey[700]
        }}
      >
        Skills
      </Typography>
      <Grid container columnSpacing={2} rowSpacing={2}>
        {formValue.map((value, index) => (
          <Grid item xs={12} sm={6} md={4}
            key={index}
          >
            <Box
              component={"div"}
              sx={{
                display: "flex",
                alignItems: "stretch",
                columnGap: "0.5em",
              }}
            >
              <FormControl fullWidth>
                <InputLabel id="skill_input_label"
                  size="small"
                  sx={{
                    color: errMsg[index] && errMsg[index]["skill_id"] ? red[500] : undefined,
                    "&.Mui-focused": {
                      color: errMsg[index] && errMsg[index]["skill_id"] ? red[500] : undefined,
                    }
                  }}
                >
                  Skill
                </InputLabel>
                <Select
                  labelId="skill_input_label"
                  name="skill"
                  label="Skill"
                  size="small"
                  value={Boolean(value.skill_id) ? String(value.skill_id) : ''}
                  onChange={(event: SelectChangeEvent) => {
                    setFormValue(prev => {
                      prev.skills[index].skill_id = Number(event.target.value)
                      return {
                        ...prev,
                      }
                    })
                  }}
                  error={errMsg[index] && Boolean(errMsg[index]["skill_id"]) ? true : false}
                >
                  {skillOption.map((skill, index) => {
                    return (
                      <MenuItem
                        key={index}
                        value={skill.id}
                        disabled={formValue.some(option => option.skill_id === skill.id)}
                      >
                        <Box component={"div"}
                          sx={{
                            display: "flex",
                            columnGap: "0.5em"
                          }}
                        >
                          <Typography variant="subtitle2">
                            {skill.name}
                          </Typography>
                          <Box component={"img"}
                            src={`http://localhost:3000${skill.skill_icon_image_path}`}
                            width={20}
                            height={20}
                            sx={{
                              objectFit: "contain"
                            }}
                          />
                        </Box>
                      </MenuItem>
                    )
                  })}
                </Select>
                {errMsg[index] && errMsg[index]["skill_id"] && (
                  <FormHelperText sx={{ color: red[500] }}>{errMsg[index]["skill_id"]}</FormHelperText>
                )}
              </FormControl>
              <Box component={"div"}
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {index !== 0 && (
                  <IconButton
                    color="error"
                    size="small"
                    onClick={deleteSkill(index)}
                  >
                    <Tooltip title="Add more skill" placement="right">
                      <DeleteRounded />
                    </Tooltip>
                  </IconButton>
                )}
                {index == formValue.length - 1 && (
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={addMoreSkill}
                  >
                    <Tooltip title="Add more skill" placement="right">
                      <AddRounded />
                    </Tooltip>
                  </IconButton>
                )}
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
import { makeStyles, TextField, Typography } from "@material-ui/core"
import { Autocomplete } from "@material-ui/lab"
import { useTheme } from "@material-ui/styles"
import { WorkPermission } from "enums/Profile"
import { ObjectId } from "mongodb"
import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
  useState
} from "react"
import { useDispatch, useSelector } from "react-redux"
import actions from "src/actions"
import { WorkAuthorizationFields } from "types/ApplicationFields"
import { RootState } from "types/RootState"

const useStyles = makeStyles((theme) => ({
  section: {
    marginTop: "1em",
    display: "flex",
    flexDirection: "column",
    gap: "1em"
  },
  sectionHeader: {
    marginBottom: "1rem"
  }
}))

interface Sponsor {
  name: string
  _id: ObjectId
}

const WorkAuthorizationSection = ({
  validate,
  setValidate,
  setValid
}: {
  validate: boolean
  setValidate: Dispatch<SetStateAction<boolean>>
  setValid: Dispatch<SetStateAction<boolean>>
}): ReactElement => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const classes = useStyles(theme)

  // Work Authorization
  const sponsors = useSelector((state: RootState) => state.sponsors.data) || []
  const [workPermission, setWorkPermission] = useState<WorkPermission | null>(null)
  const [workLocation, setWorkLocation] = useState<string>("")
  const [workStrengths, setWorkStrengths] = useState<string>("")
  const [sponsorRanking, setSponsorRanking] = useState<string[]>([])

  const validateForm = async () => {
    const data: WorkAuthorizationFields = {
      workPermission: workPermission as WorkPermission,
      workLocation,
      workStrengths,
      sponsorRanking
    }
    await dispatch(actions.application.saveWorkAuth(data))
    setValid(true)
    setValidate(false)
  }

  useEffect(() => {
    if (validate) {
      validateForm()
    }
  }, [validate])

  useEffect(() => {
    dispatch(actions.sponsors.list())
  }, [])

  return (
    <div className={classes.section}>
      <Typography variant="h5" className={classes.sectionHeader}>
        Sponsor Information
      </Typography>
      <Autocomplete
        options={Object.values(WorkPermission)}
        value={workPermission}
        onChange={(e, value) => setWorkPermission(value)}
        renderInput={(params) => (
          <TextField
            variant="outlined"
            {...params}
            label="US Work Authorization"
          />
        )}
      />
      <TextField
        label="Work Location Preferences"
        variant="outlined"
        fullWidth
        value={workLocation}
        onChange={(e) => {
          setWorkLocation(e.target.value)
        }}
      />
      <TextField
        label="Relevant Skills"
        variant="outlined"
        fullWidth
        value={workStrengths}
        onChange={(e) => {
          setWorkStrengths(e.target.value)
        }}
      />
      <Autocomplete
        multiple
        options={sponsors.map((sponsor: Sponsor) => sponsor.name)}
        onChange={(e, value) => setSponsorRanking(value as string[])}
        getOptionDisabled={(options) => sponsorRanking.length >= 5}
        renderInput={(params) => (
          <TextField
            variant="outlined"
            {...params}
            label="Rank Sponsors (Top 5)"
          />
        )}
      />
    </div>
  )
}

export default WorkAuthorizationSection

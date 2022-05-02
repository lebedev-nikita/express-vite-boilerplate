import { QuestionMark as QuestionMarkIcon } from "@mui/icons-material";
import { IconButton } from "@mui/material";

export default ({ href }) => (
  <a href={href} target="_blank" rel="noreferrer">
    <IconButton className="text-white">
      <QuestionMarkIcon />
    </IconButton>
  </a>
);

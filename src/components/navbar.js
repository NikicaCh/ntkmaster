import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AssessmentIcon from "@material-ui/icons/Assessment";
//test

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const handleLinkButton = (e) => {
  let destination = e.target.innerText.toLowerCase();
  window.location = `/${destination}`;
};

export default function Navbar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            ntkmaster
          </Typography>
          <Button color="inherit" onClick={handleLinkButton}>
            articles
          </Button>
          <Button color="inherit" onClick={handleLinkButton}>
            season
          </Button>
          <Button
            color="inherit"
            onClick={() => (window.location = "/analytics")}
          >
            <AssessmentIcon />
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

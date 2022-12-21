import React from "react";
import Switch from "@material-ui/core/Switch";

export default function Switches(props) {
  const [state, setState] = React.useState({
    checked: false,
  });

  const handleChange = (name) => (event) => {
    setState({ ...state, [name]: event.target.checked });
    props.pagination(event.target.checked);
  };
  //test

  return (
    <div className="pagination-switch">
      <span>Pagination:</span>
      <Switch
        checked={state.checked}
        onChange={handleChange("checked")}
        value="checked"
        color="primary"
        inputProps={{ "aria-label": "primary checkbox" }}
      />
    </div>
  );
}

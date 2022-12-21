import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
//test

const groupBy = (key) => (array) =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function CheckboxList(props) {
  const classes = useStyles();
  const [checked, setChecked] = React.useState([]);

  const calculateTotal = (data) => {
    let groupByArt = groupBy("Art");
    const grouped = groupByArt(data);
    let total = 0;
    Object.keys(grouped).map((_key, _index) => {
      let art = grouped[_key][0].Art;
      let quantity = 0;
      grouped[_key].map((obj) => {
        quantity += parseInt(obj.Quantity);
      });
      let price;
      props.arts.map((_art) => {
        if (_art.Name === art) {
          price = parseFloat(_art.Price);
        }
      });
      let add = (price * quantity * 0.98).toFixed(2);
      total = (parseFloat(total) + parseFloat(add)).toFixed(2);
    });
    return total;
  };

  const handleToggle = (index, value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      // checked
      newChecked.push(value);
      let total = calculateTotal(props.data[value]);
      if (!isNaN(total)) {
        let value = parseInt(props.totalValue) + parseInt(total);
        props.total(value);
      }
    } else {
      // unchecked
      newChecked.splice(currentIndex, 1);
      let total = calculateTotal(props.data[value]);
      if (!isNaN(total)) {
        let value = parseInt(props.totalValue) - parseInt(total);
        props.total(value);
      }
    }

    setChecked(newChecked);
  };

  return (
    <List className={classes.root}>
      {Object.keys(props.data).map((value, index) => {
        let q = 0;
        Object.keys(props.data[value]).map((separate) => {
          q += parseInt(props.data[value][separate].Quantity);
        });
        const labelId = `checkbox-list-label-${value}`;

        return (
          <ListItem
            key={value}
            role={undefined}
            dense
            button
            onClick={handleToggle(index, value)}
          >
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={checked.indexOf(value) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ "aria-labelledby": labelId }}
              />
            </ListItemIcon>
            <ListItemText
              id={labelId}
              primary={`Export ${index + 1} ${value}`}
            />
            <ListItemText id={labelId} primary={`${q}PA`} />
          </ListItem>
        );
      })}
    </List>
  );
}

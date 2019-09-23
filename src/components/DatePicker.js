import 'date-fns';
import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import date from 'date-and-time'


export default function DatePicker(props) {
  // The first commit of Material-UI
  const [selectedDate, setSelectedDate] = React.useState(props.date);

  function handleDateChange(changedDate) {
    setSelectedDate(changedDate);
    let formated = date.format(changedDate, "DD.MM.YYYY");
    props.selectDate(formated)
  }

  return (
    <div className="date-picker">
        <MuiPickersUtilsProvider utils={DateFnsUtils}>       
            <KeyboardDatePicker
            margin="normal"
            id="date-picker-dialog"
            label="Pick Date"
            format="dd/MM/yyyy"
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
                'aria-label': 'change date',
            }}
            />
        </MuiPickersUtilsProvider>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';

const CalendarStrips = ({style}) => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [formattedDate, setFormattedDate] = useState(moment().format('YYYY-MM-DD'));
  const [customDatesStyles, setCustomDatesStyles] = useState([]);
  const [markedDates, setMarkedDates] = useState([]);



  useEffect(() => {
    let newMarkedDates = [];
    let startDate = moment().startOf('year'); // Start from the beginning of the current year
    let endDate = moment().endOf('year'); // End at the end of the current year

    for (let m = moment(startDate); m.isBefore(endDate); m.add(1, 'days')) {
      let dayOfWeek = m.isoWeekday();
      let dots = [];
      let lines = [];

      // Yellow line for Monday, Wednesday, Friday
      if ([1, 3, 5].includes(dayOfWeek)) {
        dots.push({
          color: 'yellow',
          selectedColor: 'yellow',
        });
        dots.push({
          color: 'white',
          selectedColor: 'white',
        });
      }

      // Orange dot for Tuesday, Thursday
      if ([2, 4].includes(dayOfWeek)) {
        dots.push({
          color: 'orange',
          selectedColor: 'orange',
        });
      }

      newMarkedDates.push({
        date: m.clone(),
        dots,
        lines
      });
    }

    setMarkedDates(newMarkedDates);
  }, []);

  const datesBlacklistFunc = date => {
    return date.isoWeekday() === 6; // disable Saturdays
  };

  const onDateSelected = date => {
    setSelectedDate(date);
    setFormattedDate(date.format('YYYY-MM-DD'));
  };

  const setSelectedDateNextWeek = () => {
    const newSelectedDate = moment(selectedDate).add(1, 'week');
    setSelectedDate(newSelectedDate);
    setFormattedDate(newSelectedDate.format('YYYY-MM-DD'));
  };

  const setSelectedDatePrevWeek = () => {
    const newSelectedDate = moment(selectedDate).subtract(1, 'week');
    setSelectedDate(newSelectedDate);
    setFormattedDate(newSelectedDate.format('YYYY-MM-DD'));
  };

  // Custom Selector for Previous Week
  const CustomLeftSelector = (
    <TouchableOpacity onPress={setSelectedDatePrevWeek}>
      <Image
        contentFit="cover"
        source={require("../assets/left-arrow-black.png")}
      />
      {/* <Text style={styles.selectorText}>Prev</Text> */}
    </TouchableOpacity>
  );

  // Custom Selector for Next Week
  const CustomRightSelector = (
    <TouchableOpacity onPress={setSelectedDateNextWeek}>
      <Image
        contentFit="cover"
        source={require("../assets/right-arrow-black.png")}
      />
      {/* <Text style={styles.selectorText}>Next</Text> */}
    </TouchableOpacity>
  );

  return (
    <View style={style}>
      <CalendarStrip
        scrollable
        calendarAnimation={{ type: 'sequence', duration: 30 }}
        daySelectionAnimation={{ type: 'background', duration: 300, highlightColor: '#9265DC' }}
        style={{ height: 200, paddingTop: 20, paddingBottom: 10 }}
        calendarHeaderStyle={{ color: 'white' }}
        calendarColor={'black'}
        dateNumberStyle={{ color: 'white' }}
        dateNameStyle={{ color: 'white' }}
        iconContainer={{ flex: 0.1 }}
        // customDatesStyles={customDatesStyles}
        highlightDateNameStyle={{ color: 'white' }}
        highlightDateNumberStyle={{ color: 'yellow' }}
        highlightDateContainerStyle={{ backgroundColor: 'black' }}
        markedDates={markedDates}
        datesBlacklist={datesBlacklistFunc}
        selectedDate={selectedDate}
        onDateSelected={onDateSelected}
        useIsoWeekday={false}
        leftSelector={[CustomLeftSelector]}
        rightSelector={[CustomRightSelector]}
      />

      <Text style={{ fontSize: 24 }}>Selected Date: {formattedDate}</Text>

      {/* <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', padding: 40 }}>
        <Button
          onPress={setSelectedDatePrevWeek}
          title="Select previous week"
          color="#841584"
        />
        <Button
          onPress={setSelectedDateNextWeek}
          title="Select next week"
          color="#841584"
        />
      </View> */}
    </View>
  );
};

  const styles = StyleSheet.create({
      header: {
        backgroundColor: "#1a244d",
      },
      selectorText: {
        color: '#841584',
        fontSize: 18,
        padding: 10,
      },
  });
export default CalendarStrips;
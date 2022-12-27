import moment from "moment";

const formatDateHoursMinutesPostOrAnteMeridiem = (date: Date) => {
  /* 00:00 am or pm' */
  return moment(date).format("hh:mm a");
};

export { formatDateHoursMinutesPostOrAnteMeridiem };

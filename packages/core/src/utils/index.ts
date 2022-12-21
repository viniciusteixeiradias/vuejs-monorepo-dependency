import moment from "moment";

const formatDate = (date: Date) => {
  // TODO: '00:00 am'
  return moment(date).format("hh:mm a");
};

export { formatDate };

import * as moment from 'moment';
export const DateFormatter = (date) => {
    if (date) {
        return moment(date).format('YYYY-MM-DD hh:mm A');
    }
}
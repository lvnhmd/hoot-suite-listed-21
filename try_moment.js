const moment = require('moment');

let publishAt = moment(moment.now()).add(1, 'hour');
for (let i = 0; i < 8; i++) {
  publishAt = moment(publishAt).add(15, 'minutes');
  console.log(publishAt.format('YYYY/MM/DD hh:mm a'));
}

const bcrypt = require('bcryptjs');
const hash = '\\/eP5ps4xTbpx6/FI2N/ywgiTfs5qYuQsK';
const password = 'admin123!';

bcrypt.compare(password, hash).then(result => {
  console.log(result ? 'MATCH' : 'NO MATCH');
}).catch(err => {
  console.error(err);
});

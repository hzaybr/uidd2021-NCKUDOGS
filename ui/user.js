// https://luffy.ee.ncku.edu.tw/~IzsKon/sns/fb_login.html

var address = location.href
console.log(address)

/* Get user ID through url */
var USER_ID = address.match(/id=(\W|\w|\z)*&user=/)[0].slice(3).slice(0,-6);
USER_ID = decodeURI(USER_ID);
console.log(`User id: ${USER_ID}`);

/* Get user name through url */
var USER_NAME = address.match(/&user=(\W|\w|\z)*&pic=/)[0].slice(6).slice(0,-5);
USER_NAME = decodeURI(USER_NAME);
console.log(`User name: ${USER_NAME}`);
$('.username').attr('id',USER_NAME);
// $('.username').html(this.atrr('id')).show();

/* Get user profile pic through url */
var PROFILE_PIC = atob(address.match(/&pic=(\W|\w|\z)*/)[0].slice(5));
PROFILE_PIC = decodeURI(PROFILE_PIC);
console.log(`Profile pic url: ${PROFILE_PIC}`);
let avatars = document.getElementsByClassName('profile-avatar');
for (let i = 0; i < avatars.length; ++i) {
  avatars[i].src = PROFILE_PIC;
}

var jsonfile = require('jsonfile');
for (i=0; i <11 ; i++){
  console.log('write')
     jsonfile.writeFile('loop.json', "id :" + i + " square :" + i*i);
   }

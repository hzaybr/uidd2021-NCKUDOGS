// https://luffy.ee.ncku.edu.tw/~IzsKon/sns/fb_login.html

/* Decode url */
var info = location.href.match(/.html(\W|\w|\z)*/)[0].slice(19);
info = decodeURIComponent(window.atob(info));

/* Get user ID through url */
var USER_ID = info.match(/id=(\W|\w|\z)*&user=/)[0].slice(3).slice(0,-6);
console.log(`User id: ${USER_ID}`);

/* Get user name through url */
var USER_NAME = info.match(/&user=(\W|\w|\z)*&pic=/)[0].slice(6).slice(0,-5);
console.log(`User name: ${USER_NAME}`);
$('.username').attr('id',USER_NAME);

/* Get user profile pic through url */
var PROFILE_PIC = info.match(/&pic=(\W|\w|\z)*/)[0].slice(5);
console.log(`Profile pic url: ${PROFILE_PIC}`);
let avatars = document.getElementsByClassName('avatar');
for (let i = 0; i < avatars.length; ++i) {
  avatars[i].src = PROFILE_PIC;
}

$('.XXicon').click(function() {
  window.location.assign(`https://hzaybr.github.io/uidd2020/index.html`);
});

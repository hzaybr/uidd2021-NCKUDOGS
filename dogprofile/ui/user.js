let _user = localStorage.getItem("user");
_user = JSON.parse(_user);

var USER_ID = _user.id;
var USER_NAME = _user.name;
var PROFILE_PIC = _user.image_url;

console.log(`User id: ${USER_ID}`);
console.log(`User name: ${USER_NAME}`);
console.log(`Profile pic url: ${PROFILE_PIC}`);

$('.username').attr('id',USER_NAME);

let avatars = document.getElementsByClassName('profile-avatar');
for (let i = 0; i < avatars.length; ++i) {
  avatars[i].src = PROFILE_PIC;
}

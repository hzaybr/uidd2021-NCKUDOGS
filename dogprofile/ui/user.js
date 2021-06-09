let _user = localStorage.getItem("user");
_user = JSON.parse(_user);

var USER_ID = _user.id;
var USER_NAME = _user.name;
var PROFILE_PIC = _user.image_url;

	const promise = new Promise((resolve, reject) => {
			$.post('./load_users', {dog_id: 1}, (user_json) => {
				user_data = JSON.parse(user_json);
				resolve(user_data);
			});
	});
  promise.then((value) => {
    if(value[USER_ID]){
      USER_NAME = value[USER_ID]["name"];
      PROFILE_PIC = value[USER_ID]["profile"];
    }
    else{
   		$.post('./update_users', {
				id:	USER_ID,
				name:	USER_NAME,
				profile:	PROFILE_PIC
			}, () => {});  
    }
    console.log(`User id: ${USER_ID}`);
    console.log(`User name: ${USER_NAME}`);
    console.log(`Profile pic url: ${PROFILE_PIC}`);
		
    $('.username').attr('id',USER_NAME);
    $('.username').html(USER_NAME).show();

    let avatars = document.getElementsByClassName('profile-avatar');
    for (let i = 0; i < avatars.length; ++i) {
      avatars[i].src = PROFILE_PIC;
    }
  
    $('.map-profile-avatar').attr('src',PROFILE_PIC)
	});

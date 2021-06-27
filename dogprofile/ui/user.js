let login_status = false
const USER = {};

function onSignIn(googleUser) {
  login_status = true;
  // Useful data for your client-side scripts:
  const profile = googleUser.getBasicProfile()
  console.log('Success Login');
  console.log(`GOOGLE ID: ${profile.getId()}`) // Don't send this directly to your server!
  console.log(`GOOGLE Name: ${profile.getName()}`)
  console.log(`GOOGLE Image URL: ${profile.getImageUrl()}`)

        // The ID token you need to pass to your backend:
        var id_token = googleUser.getAuthResponse().id_token
          
        //get userID
        $.post('/idtoken', {
          idToken: id_token
          },(data)=>{

			Object.defineProperties(USER, {
				'id': { value: profile.getId() },
				'name': {
					value: profile.getName(),
					writable: true
				},
				'profile': {
					value: profile.getImageUrl(),
					writable: true
				}
			});

            $('#username').html(USER.name)

            $.getScript('../after_login.js');
					  
            reload_user();
            if(window.location.href.split('/').filter(e => e).slice(-1) == "dog.html"){
              if(load_complete){
                reload_comment();
              }
            }
            else if(window.location.href.split('/').filter(e => e).slice(-1) == "index.html"){
              load_profile_num();
						}
            else if(window.location.href.split('/').filter(e => e).slice(-1) == "userprofile.html"){
              load_profile_detail();
						}
            //localStorage.setItem("user", JSON.stringify({id: userid, name: `${profile.getName()}`, image_url: `${profile.getImageUrl()}`}));
				})
				$('.unlogin').fadeOut(500);
      }
			
      function signOut() {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
          console.log('User signed out.');
					window.location.reload();
        });
      }

function reload_user(){
  $.post('./update_users', {
		id:	USER.id,
		name:	USER.name,
		profile:	USER.profile
  }, () => {});  
 
  const promise = new Promise((resolve, reject) => {
   		$.post('./get_unique_user', {
				  id:	USER.id
        }, (user_info) => {resolve(JSON.parse(user_info))});  
    /*
    $.post('./load_users', {dog_id: dog_page_id}, (user_json) => {
				user_data = JSON.parse(user_json);
				resolve(user_data);
      });
      */
	});
  promise.then((user_info) => {
    USER.name = user_info.name;
    USER.profile = user_info.profile;
    /*
    else{
      console.log('first_login')
   		$.post('./update_users', {
				id:	USER.id,
				name:	USER.name,
				profile:	USER.profile
			}, (value) => {});  
    }
    */
    console.log(`Database id: ${USER.id}`);
    console.log(`Database name: ${USER.name}`);
	console.log(`Database PIC: ${USER.profile}`);
    	
    $('.pg .username').attr('id',USER.name);
    $('.pg .username').html(USER.name).show();
    $('.pg .profile-avatar, .heart-grid .profile-avatar,.writing-container .profile-avatar').attr('src',USER.profile); 
    /*
    let avatars = document.getElementsByClassName('profile-avatar');
    for (let i = 0; i < avatars.length; ++i) {
      avatars[i].src = USER.profile;
    }
    */ 

    try{
		  initMap();
    }catch{}
	});
}

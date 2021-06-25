let login_status = false
let USER_ID;
let USER_NAME;
let PROFILE_PIC;

function onSignIn(googleUser) {
  login_status = true;
  // Useful data for your client-side scripts:
  var profile = googleUser.getBasicProfile()
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
            var userid = data.sub
           	USER_ID = userid;
						USER_NAME = profile.getName();
						PROFILE_PIC = profile.getImageUrl();

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
		id:	USER_ID,
		name:	USER_NAME,
		profile:	PROFILE_PIC
  }, () => {});  
 
  const promise = new Promise((resolve, reject) => {
   		$.post('./get_unique_user', {
				  id:	USER_ID
        }, (user_info) => {resolve(JSON.parse(user_info))});  
    /*
    $.post('./load_users', {dog_id: dog_page_id}, (user_json) => {
				user_data = JSON.parse(user_json);
				resolve(user_data);
      });
      */
	});
  promise.then((user_info) => {
    USER_NAME = user_info.name;
    PROFILE_PIC = user_info.profile;
    /*
    else{
      console.log('first_login')
   		$.post('./update_users', {
				id:	USER_ID,
				name:	USER_NAME,
				profile:	PROFILE_PIC
			}, (value) => {});  
    }
    */
    console.log(`Database id: ${USER_ID}`);
    console.log(`Database name: ${USER_NAME}`);
	  console.log(`Database PIC: ${PROFILE_PIC}`);
    	
    $('.pg .username').attr('id',USER_NAME);
    $('.pg .username').html(USER_NAME).show();
    $('.pg .profile-avatar, .heart-grid .profile-avatar,.writing-container .profile-avatar').attr('src',PROFILE_PIC); 
    /*
    let avatars = document.getElementsByClassName('profile-avatar');
    for (let i = 0; i < avatars.length; ++i) {
      avatars[i].src = PROFILE_PIC;
    }
    */ 

    try{
		  initMap();
    }catch{}
	});
}

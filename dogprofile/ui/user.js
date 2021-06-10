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
					  
            reload_user();
            if(window.location.href.split('/').filter(e => e).slice(-1) == "dog.html"){
              load_user();
              reload_comment();
            }
            else if(window.location.href.split('/').filter(e => e).slice(-1) == "index.html"){
              load_profile();
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
      console.log('first_login')
   		$.post('./update_users', {
				id:	USER_ID,
				name:	USER_NAME,
				profile:	PROFILE_PIC
			}, () => {});  
    }
    console.log(`Database id: ${USER_ID}`);
    console.log(`Database name: ${USER_NAME}`);
	  console.log(`Database PIC: ${PROFILE_PIC}`);
    	
    $('.username').attr('id',USER_NAME);
    $('.username').html(USER_NAME).show();

    let avatars = document.getElementsByClassName('profile-avatar');
    for (let i = 0; i < avatars.length; ++i) {
      avatars[i].src = PROFILE_PIC;
    }
 	  	
    try{
		  initMap();
    }catch{}
	});
}

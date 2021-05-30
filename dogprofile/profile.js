var hide_class
const container_list = ['.comment-container', '.pic-container', '.gps-container']
const scrollbar_position = ['15vw', '43.1vw', '71.5vw']


$('.button').click(function() {
  from = $(this).attr('id')[0];
  to = $(this).attr('id')[1];

  if(from!=to){
    $(this).css('color','black');
    hide = container_list[from];
    show = container_list[to];
    console.log(`hide ${hide}, show ${show}`);
    yellow = `#${to+to}`;
    console.log(yellow);

    $('.scroll-bar').animate({'left': scrollbar_position[to]}, 150);
    setTimeout(function() {
      $(yellow).css('color','#ff8b2c'); }, 100 
      );
    $(hide).hide();
    $(show).show();
  };
})

$('.XXicon').click(function() {
  window.location.assign('index.html')
});


/**********************************/
$(document).ready(function(){
  $.post('/load_profile_cmt', {
    userID: USER_ID
    }, (data) =>{
      let len = Object.keys(data).length
      for(i=len; i>=0; i--){
          console.log(data[i])
       }
   
    
    })

})


/*	$.get(usersfile, function(usr_json){
		comments =  usr_json[USER_ID]["comments"];
		score =  usr_json[USER_ID]["score"];
		photos =  usr_json[USER_ID]["photos"];

    cmt_txt = ""
		for (var c in comments){
      cmt_txt += "<div class=\"c-border\">"
			cmt_txt +=   "<img width=\"80%\" src=\"./aboutus_appv/image/Group 322@3x.png\">"
			cmt_txt +=   "<div class=\"cmt-sub-grid\">"
			cmt_txt +=     "<p style=\"margin:1vw; font-size:3.8vw; font-weight:bold;\">米香</p>"
			cmt_txt +=     "<div style=\"margin: 1vw;padding-top:1.5vw;\">"
			for(i=0;i<score;i++){
				cmt_txt +=     "<img style=\"width:4%\" src=\"./image/red_heart.png\">"
			}
			for(;i<5;i++){
				cmt_txt +=     "<img style=\"width:4%\" src=\"./image/gray_heart.png\">"
			}
			cmt_txt +=     "</div>"
			cmt_txt +=     "<p style=\"margin:1vw;font-size:3.6vw;\">"+comments[c]+"</p>"
			cmt_txt +=   "</div>"
			cmt_txt += "</div>"
      console.log(comments[c])
		};

		$('.comment-grid').html(cmt_txt);

    p_txt = ""
    var pic_num = Object.keys(photos).length
    var row = pic_num%3 + 1
    console.log(row)
    $('.pic-grid').css("grid-template-rows", `repeat(${row}, 33.1vw)`)
    for(var p in photos){
      p_txt += `<div class="grid-photo" style="background-image:url(${photos[p]})"></div>`
    }
    $('.pic-grid').html(p_txt);

	});
});
*/

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

/**********************************/
const usersfile = "./data/users.json"
var comments 
var score

$(document).ready(function(){
	$.get(usersfile, function(usr_json){
		comments =  usr_json[USER_ID]["comments"];
		score =  usr_json[USER_ID]["score"];
		console.log(comments);
    cmt_txt = ""

		for (var c in comments){
      cmt_txt += "<div class=\"c-border\">"
			cmt_txt += "<img width=\"80%\" src=\"./aboutus_appv/image/Group 322@3x.png\">"
			cmt_txt += "<div class=\"cmt-sub-grid\">"
			cmt_txt += "<p style=\"margin:1vw; font-size:3.8vw; font-weight:bold;\">米香</p>"
			cmt_txt += "<div style=\"margin: 1vw;padding-top:1.5vw;\">"
			for(i=0;i<score;i++){
				cmt_txt += "<img style=\"width:4%\" src=\"./image/red_heart.png\">"
			}
			for(;i<5;i++){
				cmt_txt += "<img style=\"width:4%\" src=\"./image/gray_heart.png\">"
			}
			cmt_txt += "</div>"
			cmt_txt += "<p style=\"margin:1vw;font-size:3.6vw;\">"+comments[c]+"</p>"
			cmt_txt += "</div>"
			cmt_txt += "</div>"
			cmt_txt += "</div>"
      console.log(comments[c])
		};

		$('.comment-grid').html(cmt_txt);
	});

});

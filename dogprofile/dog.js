var hide_class
const container_list = ['.intro-container', '.pic-container', '.comment-container', '.report-container']
const scrollbar_position = ['10vw', '32.5vw', '55vw', '77.5vw']

let score = 0;
let comment_id = 0;
let image_id = 0;
let user_data = "";
let is_editing = false;
let editing_comment_id = 0;
let blank_pic = "https://upload.wikimedia.org/wikipedia/commons/c/ca/1x1.png";

$('html').click(function(e) {
  if(!$(e.target).hasClass('cmt-btn'))
  {
    let elements = document.getElementsByClassName("cmt-option");
    for (let i = 0; i < elements.length; ++i) {
      elements[i].classList.remove("show");
    }
  }
});

//id: from, to
$('.start-button').click(function() {
  $(this).css('color','black');
  to = $(this).attr('id')[1];
  show = container_list[to];
  console.log(`show ${show}`);
  yellow = `#${to+to}`;

  $('.start').hide();
  $(show).show();
  $(show).animate({'top':'0'}, 150);

  $('.scroll-bar').animate({'left': scrollbar_position[to]}, 150);
  setTimeout(function() {
    $(yellow).css('color','#ff8b2c'); 
    container_list.forEach(function(item, i) {
      $(item).css({'top':'0'});
    });
  }, 150);
})

$('.d-all').click(function() {
  $('.start').hide();
  $('.intro-container').show();
  $('.intro-container').animate({'top':'0'}, 150);

  setTimeout(function() {
    $('#00').css('color','#ff8b2c'); 
    container_list.forEach(function(item, i) {
      $(item).css({'top':'0'});
    });
  }, 150);
})
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

$('.arrow').click(function() {
  now = $(this).attr('id')[1];
  $(container_list[now]).animate({'top':'65vw'}, 150);
  $('.scroll-bar').animate({'left': '10vw'}, 150);

  setTimeout(function() {
    $(container_list[now]).hide();
    $('.start').show(); 
    $('#s0').css('color','#ff8b2c'); 
    container_list.forEach(function(item, i) {
      $(item).css({'top':'65vw'});
      $(item).hide();
    });
  }, 150);
});

$('.heart').click(function() {
  $('.pop-com').fadeIn();

  score = $(this).attr('id')[1];
  console.log(`score: ${score}`);
  for (i=1; i<=5; i++){
    //heart in comment
    hid = `.heart:nth-child(${i+1})`;
    if(i<=score){
    $(hid).attr('src','./image/red_heart.png');
    }
    else {
    $(hid).attr('src','./image/heart.png');
    }
  };
});

$('#cancel-btn').click(function() {
  $('.pop-com').hide();
  $('.heart').attr('src','./image/heart.png');
});

$('.write-com').click(function() {
  $('.comment-container').hide();
  $('.writing-container').show();
  
  for (i=1; i<=5; i++){
    hid = `.w-heart:nth-child(${i})`;
    if(i<=score){
      // console.log($(hid).attr('id'));
      $(hid).attr('src','./image/red_heart.png');
    }
    else {
      $(hid).attr('src','./image/heart.png');
    }
  }
});

$('#writing-cancel-btn').click(function() {
  is_editing = false;
  $('.commentBox').val('');
  $('.comment-container').fadeIn();
  $('.writing-container').hide();
  $('.w-heart').attr('src','./image/heart.png');
  $('.heart').attr('src','./image/heart.png');
  $('.pop-com').hide();
});

$('.w-heart').click(function() {
  score = $(this).attr('id')[2];
  console.log(`score: ${score}`);
  for (i=1; i<=5; i++){
    hid = `.w-heart:nth-child(${i})`;
    if(i<=score){
    $(hid).attr('src','./image/red_heart.png');
    }
    else {
    $(hid).attr('src','./image/heart.png');
    }
  };
});
$('.mesng-icon').click(function() {
	//window.open('https://www.facebook.com/ncku.vdogs');
	window.open('https://m.me/ncku.vdogs');
});

/*****************/
$('.navig').click(function() {
  var dogID = $(this).attr('id');

  $.post('./navig', {
    dogID: dogID
    },(data) =>{
    });
    window.location.assign("https://luffy.ee.ncku.edu.tw:15038/index.html?"+redir_url+"&");
});


$('.XXicon').click(function() {
  window.location.assign("https://luffy.ee.ncku.edu.tw:15038/index.html?"+redir_url+"&");
});





/***************************************************************** */

$(function(){

	$.post('./update_users', {
		id: 		USER_ID,
		name:		USER_NAME,
		profile:	PROFILE_PIC,
		score:		""
	}, () => {});

	load_user(); // Load in user data first

	/* 
	 * The 1 sec delay is essential for high success rate
	 * of comment being loaded correctly.
	 * I tried using Promise to ensure executing order but doesn't work.
	 */
	setTimeout(load_comment, 1000);
	setTimeout(load_image, 1000);

});

$('#post-btn, #writing-post-btn').click(function() {

	// if ($('.commentBox').val().length == 0)
	// 	return;


	user_data[USER_ID].score = score;

	if (!is_editing) { // write a new comment
		concat_comment(++comment_id, USER_ID, $('.commentBox').val(), $('.preview-pic')[0].src);
	}
	
	$.post('./update_users', {
		id: 		USER_ID,
		name:		USER_NAME,
		profile:	PROFILE_PIC,
		score:		score
	}, () => {});

	const promise = new Promise((resolve, reject) => {
		$.post('./post_comment', {
			comment_id: is_editing? editing_comment_id : comment_id,
			user_id:	USER_ID,
			comment:	$('.commentBox').val(),
			photo:		$('.preview-pic')[0].src
		}, (resp) => {
			resolve(resp);
		});
	});

	$('.preview-pic')[0].src = blank_pic;
	$('.commentBox').val('');
	$('.comment-container').fadeIn();
	$('.writing-container').hide();
	$('.w-heart').attr('src','./image/heart.png');
	$('.heart').attr('src','./image/heart.png');
	$('.pop-com').hide();

	promise.then((value) => {
		reload_comment();
	});

	is_editing = false;
});

/* convert image to base 64 */
function post_image() {

    if (this.files && this.files[0]) {
    
        var FR = new FileReader();
        
        FR.addEventListener("load", function(e) {
			concat_image(++image_id, PROFILE_PIC, e.target.result);

            $.post("./upload_image", {
                image_id: image_id,
				user_id: USER_ID,
                photo: e.target.result
            }, () => {});
        });
    
        FR.readAsDataURL( this.files[0] );
    }
}

function add_pic_to_comment() {
	if (this.files && this.files[0]) {
        var FR = new FileReader();     
        FR.addEventListener("load", function(e) {
			$('.preview-pic')[0].src = e.target.result;
        });
        FR.readAsDataURL( this.files[0] );
    }
}

document.getElementById("fl_file").addEventListener("change", post_image);
document.getElementById("post-pic-in-comment").addEventListener("change", add_pic_to_comment);

function concat_comment(comment_id, user_id, comment, photo) {

	let cmt_id = "comment_" + comment_id;
	let cmtpic_id = "cmtpic_" + comment_id;
	let content_id = "content_" + comment_id;
	let btn_dlt_id = "btn_dlt_" + comment_id;
	let btn_edit_id = "btn_edit_id" + comment_id;
	let option_id = "cmt_option_" + comment_id;
	let user = user_data[user_id];

	$(`<div class=\"user-comment\" id=${cmt_id}>`).prependTo('.comments');
	let txt = "";

	/* User name and profile pic */
	txt += 	"<div class=\"w-user-bar\">";
	txt += 		`<img class=\"avatar\" src=${user.profile}>`;
	txt += 		`<div class=\"username\" style=\"display: block;\">${user.name}</div>`;
	txt += 	"</div>";

	/* User score */
	txt += 	"<div class=\"comment-score\">"
	let i;
	for (i = 0; i < user.score; ++i) {
		txt += "<img style=\"width:5%\" src=\"./image/red_heart.png\">"
	}
	for(; i < 5; ++i) {
		txt +=  "<img style=\"width:5%\" src=\"./image/gray_heart.png\">"
	}
	
	if (user_id == USER_ID) {
		console.log("edit");
		txt += 	`<div class=\"cmt-btn\" onclick=\'(function(){document.getElementById(\"${option_id}\").classList.toggle(\"show\");})();'>AA`;
		txt += 		`<span class=\"cmt-option\" id=${option_id}>`;
		txt += 			`<button class=\"cmt-dlt-btn\" id=${btn_dlt_id}>刪除</button>`;
		txt += 			"<hr class=\"cmt-btn-ln\">";
		txt += 			`<button class=\"cmt-edit-btn\" id=${btn_edit_id}>編輯</button>`;
		txt += 		"</span>";
		txt += 	"</div>";
	}

    txt +=	"</div>"

	/* User comment */
	txt +=	`<div class=\"comment\" id=${content_id}>${comment}</div>`;
	txt +=  `<img class=\"comment-pic\" id=${cmtpic_id} src=${photo}></img>`;
	
	$(`#${cmt_id}`).html(txt);

	if (user_id == USER_ID) {
		/* Add delete button function */
		$(`#${btn_dlt_id}`).click(function () {
			const promise = new Promise((resolve, reject) => {
				$.post("./delete_comment", {
					id: comment_id,
				}, (resp) => {
					resolve(resp);
				});
			});				
			promise.then((value) => {
			reload_comment();
			});			
		});

		/* Add edit button function */
		$(`#${btn_edit_id}`).click(function () {			
			editing_comment_id = comment_id;
			is_editing = true;
			score = user.score;

			$('.comment-container').hide();
			$('.writing-container').show();
			for (i = 1; i <= 5; i++){
				hid = `.w-heart:nth-child(${i})`;
				if (i <= score) {
				  $(hid).attr('src','./image/red_heart.png');
				}
				else {
				  $(hid).attr('src','./image/heart.png');
				}
			}

			$('.commentBox').val($(`#${content_id}`)[0].innerHTML);
      $('.preview-pic')[0].src = photo;
		});

	}
}

function load_comment() {
	$.post("./load_comments", (cmt_json) => {		
		/*
		 * To ensure all [comment_id] are unique,
		 * the newer comment will always have the bigger [comment_id].
		 */
		$.each(JSON.parse(cmt_json), function(index, val) {
			comment_id = parseInt(index, 10);
			concat_comment(comment_id, val.user, val.comment, val.photo);
		});
	});
}

function reload_comment() {
	var x = document.getElementsByClassName("user-comment");
	for(var i = x.length - 1; i >= 0; i--) {
		x[i].parentNode.removeChild(x[i]);
	}

	load_comment();
}

function concat_image(image_id, user_pic, photo) {
	let id = "image_" + image_id;
	$(`<span class=\"image-image\" id=${id}>`).prependTo(".pic-grid");

	let txt = "";
	txt += 	"<div class=\"user-pic-for-image\">";
	txt += 		`<img class=\"avatar\" src=${user_pic} width=100%>`;
	txt += 	"</div>";
	txt += 	`<img src=${photo} width=100%>`;

	$(`#${id}`).html(txt);
}

function load_image() {
	$.post("./load_images", (img_json) => {
		$.each(JSON.parse(img_json), function(index, val) {
			let pic = user_data[val.user].profile;
			image_id = parseInt(index, 10);
			concat_image(image_id, pic, val.photo);
		});
	});
}

function load_user() {
	$.post("./load_users", (user_json) => {
		user_data = JSON.parse(user_json);

		/* Sum of score */
		let sum = 0;
		let score = [0,0,0,0,0,0];
		$.each(user_data, function(index, val) {
			sum += val.score;
			++score[val.score];
		});

		/* Score bars */
		let obj = document.getElementsByClassName("score-bar-count");
		for (let i = 1; i <= obj.length; ++i) {
			obj[obj.length-i].style.width = `${score[i] * 100 / Math.max(...score)}%`;
		}
		
		/* Total users */
		let user_len = Object.keys(user_data).length - score[0];
		document.getElementById("review-count").innerHTML = `(${user_len})`;

		/* Average score */
		let avg_score = Math.round(10 *　sum / user_len) / 10;
		obj = document.getElementsByClassName("average-score");
		for (let i = 0; i < obj.length; ++i) {
  			obj[i].innerHTML = avg_score;
		}

		/* Hearts */
		for (let i = 0; i <= avg_score; ++i) {
			heart = `.info-heart:nth-child(${i+1}), .review-heart:nth-child(${i})`;
			$(heart).attr('src','./image/red_heart.png');
		}
		
	});
}

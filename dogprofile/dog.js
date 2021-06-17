var hide_class
const container_list = ['.intro-container', '.pic-container', '.comment-container', '.report-container']
const scrollbar_position = ['10vw', '32.5vw', '55vw', '77.5vw']

let SCORE = 0;
let user_data = {};
let is_editing = false;
let editing_comment_id = 0;
const BLANK_PIC = "https://upload.wikimedia.org/wikipedia/commons/c/ca/1x1.png";
const LOADING_PIC = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACXBIWXMAAAsSAAALEgHS3X78AAAAG3RFWHRTb2Z0d2FyZQBDZWxzeXMgU3R1ZGlvIFRvb2zBp+F8AAAADUlEQVQI12M8d+7cfwAIRwNrXorEqAAAAABJRU5ErkJggg=="

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
 
  if(login_status){
    $('.pop-com').fadeIn();

    SCORE = $(this).attr('id')[1];
    console.log(`score: ${SCORE}`);
    for (i=1; i<=5; i++){
      //heart in comment
      hid = `.heart:nth-child(${i+1})`;
      if(i<=SCORE){
        $(hid).attr('src','./image/red_heart.png');
      }
      else {
        $(hid).attr('src','./image/heart.png');
      }
    };
  }
  else {
   $('.unlogin').fadeIn(500);
  }
});

$('.unlogin').click(function(){
  $('.unlogin').fadeOut(500);
})

$('.add-pic').click(function(e){
  if(!login_status){
    e.preventDefault();
    $('.unlogin').fadeIn(500);   
  }
})

$('#cancel-btn').click(function() {
  $('.pop-com').hide();
  $('.heart').attr('src','./image/heart.png');
});

$('.write-com').click(function() {
  $('.comment-container').hide();
  $('.writing-container').show();
  
  for (i=1; i<=5; i++){
    hid = `.w-heart:nth-child(${i})`;
    if(i<=SCORE){
      // console.log($(hid).attr('id'));
      $(hid).attr('src','./image/red_heart.png');
    }
    else {
      $(hid).attr('src','./image/heart.png');
    }
  }
});

$('#writing-cancel-btn').click(hide_commentBox);

function hide_commentBox() {
	is_editing = false;
	$('.preview-pic')[0].src = BLANK_PIC;
	$('.commentBox').val('');
	$('.comment-container').fadeIn();
	$('.writing-container').hide();
	$('.w-heart').attr('src','./image/heart.png');
	$('.heart').attr('src','./image/heart.png');
	$('.pop-com').hide();
}

$('.w-heart').click(function() {
  SCORE = $(this).attr('id')[2];
  console.log(`score: ${SCORE}`);
  for (i=1; i<=5; i++){
    hid = `.w-heart:nth-child(${i})`;
    if(i<=SCORE){
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

/******************************************************************/
$('.navig').click(function() {
  window.location.assign("index.html");
});

$('.XXicon').click(function() {
  localStorage.setItem("dog page id", 50)
  window.location.assign("index.html");
});


/*******************************************************************/
const dogfile = "./dog.json"
const IDfile = "./map/navig.json"
let dog_page_id = localStorage.getItem("dog page id")

$(document).ready(function() {
  $.get(dogfile, function(json){
    var dog = json[dog_page_id]
    document.title = `${dog["name"]}｜汪汪`;
    $('#dogname').html(dog["name"]);
    $('.top-name').html(dog["name"]);
    $('#subname').html(dog["subname"]);
    $('.place').html(dog["place"]);
    $('.health-info').html(dog["health-info"]);
    $('#li-intro').html(dog["li-intro"]);
    $('#all-info').html(dog["all-info"]);
    $('.top-pic').css('background-image',`url(./image/${dog_page_id}.jpg)`);
  });
});



/******************************************************************/
document.getElementById("fl_file").addEventListener("change", post_image);
document.getElementById("fl_file2").addEventListener("change", post_image);
document.getElementById("post-pic-in-comment").addEventListener("change", add_pic_to_comment);

$(function(){
 /*
	$.post('./update_users', {
		id: 		USER_ID,
		name:		USER_NAME,
		profile:	PROFILE_PIC
	}, () => {});
  */
	/* Initialize image and comment section */
	const promise = new Promise((resolve, reject) => {
		$.post('./load_users', {dog_id: dog_page_id}, (user_json) => {
			user_data = JSON.parse(user_json);
			resolve(user_data);
		});
	});
	promise.then((value) => {
		load_user();
		load_image();
		load_comment();
	});

});

$('#post-btn, #writing-post-btn').click(function() {

	user_data[USER_ID].score = SCORE;

	$.post('./update_score', {
		user_id: 	USER_ID,
		dog_id:		dog_page_id,
		score:		SCORE
	});

	if (is_editing) {
		const promise = new Promise((resolve, reject) => {
			$.post('./edit_comment', {
				comment_id: editing_comment_id,
				comment:	$('.commentBox').val(),
				photo:		$('.preview-pic')[0].src
			}, (finished) => {
				resolve(finished);
			});
		});

		promise.then((finished) => {
			reload_comment();
		});
	}
	else {
		const promise = new Promise((resolve, reject) => {
			$.post('./post_comment', {
				user_id:	USER_ID,
				dog_id:		dog_page_id,
				comment:	$('.commentBox').val(),
				photo:		$('.preview-pic')[0].src
			}, (comment_id) => {
				resolve(comment_id);
			});
		});

		promise.then((comment_id) => {
			concat_comment(comment_id, USER_ID, $('.commentBox').val(), $('.preview-pic')[0].src);
			reload_comment();
		});
	}

	hide_commentBox();
});

const FR = new FileReader();
let temp_id = -1;
FR.addEventListener("load", function(e) {
	__show_and_upload_image(temp_id--, e);
});

function post_image() {

    if (!(this.files && this.files[0]))
		return;

	const file = this.files[0];

	heic2any({
		blob: file,
		toType: "image/jpeg",
		quality: 0.1
	})
	.then((result) => { // result is a BLOB of the JPG formatted image
		FR.readAsDataURL(result);
	})
	.catch((errorObject) => {
		(errorObject.code === 1)
		? FR.readAsDataURL(file)	// file is not HEIC
		: console.log(errorObject);	// other errors
	});
}

function downscaleImage(dataUrl) {

	return new Promise((res, rej) => {

		/* Create a temporary image to compute the height of the downscaled image */
		let image = new Image();
		image.src = dataUrl;

		image.onload = function() {
			
			let width = image.width, height = image.height;
			let ratio = width / height;
			const max_length = 600;
			if (width >= height && width > max_length) {
				width = max_length;
				height = Math.floor(width / ratio);
			}
			else if (width < height && height > max_length) {
				height = max_length;
				width = Math.floor(height * ratio);
			}
		
			/* Create a temporary canvas to draw the downscaled image on */
			let canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
		
			/* Draw the downscaled image on the canvas and return the new data URL */
			let ctx = canvas.getContext("2d");
			ctx.drawImage(image, 0, 0, width, height);

			res(canvas.toDataURL("image/jpeg", 1)); // image quality = 100%
		}

	});
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

function concat_comment(comment_id, user_id, comment, photo) {
	__generate_comment_section_html(comment_id, user_id, comment, photo);
	if (user_id == USER_ID) { // User can edit this comment
    __generate_comment_buttons(comment_id, user_id, comment, photo);
	}
}

let load_complete=false;
function load_comment() {
	$.post('./load_comments', {dog_id: dog_page_id}, (cmt_json) => {
		$.each(JSON.parse(cmt_json), function(index, val) {
			concat_comment(index, val.user_id, val.comment, val.photo);
    });
    load_complete = true;
	});
}

function reload_comment() {
	var x = document.getElementsByClassName("user-comment");
	for(var i = x.length - 1; i >= 0; i--) {
		x[i].parentNode.removeChild(x[i]);
	}
	load_comment();
}

async function concat_image(image_id, user_pic, photo) {
	const id = "image_" + image_id;
	const img_btn_id = "liked_btn_" + image_id;
	$(`<span class=\"image-image\" id=${id}>`).prependTo(".pic-grid");

	let txt = "";
	/* user profile pic */
	txt += 	`<div class="user-pic-for-image">`;
	txt += 		`<img class="profile-avatar" src=${user_pic} width=100%>`;
	txt += 	"</div>";

	/* like button */
	txt +=	`<div class="photo-like">`;
	txt +=		`<img id=${img_btn_id} class="photo-like-heart-button" src="./image/avatar_dog1.png" width=10%>`;
	txt +=	`</div>`;

	/* photo */
	txt += 	`<img class="image-grid-image" src=${photo} width=100% height=100%>`;

	$(`#${id}`).html(txt);

	/* add like button function */
	$(`#${img_btn_id}`).click(function () {
		$.post('./like_image', {
			user_id:	USER_ID,
			image_id:	image_id
		});
	})
}

function load_image() {

	const promise = new Promise((resolve, reject) => {
		var id_arr = [];
		$.post('./preload_images', {dog_id: dog_page_id}, (image_ids) => {
			if(image_ids) {
				id_arr = image_ids.split(',');
			}
			id_arr.forEach(index => {
				concat_image(index, LOADING_PIC, null);
			})
			resolve(id_arr.reverse());
		});
	});

	promise.then((id_arr) => {
		id_arr.forEach(index => {
			$.post('./query_image', {id: index}, (image) => {
				image = JSON.parse(image);
				$(`#image_${image.id} .profile-avatar`)[0].src = user_data[image.user_id].profile;
				$(`#image_${image.id} .image-grid-image`)[0].src = image.photo;
			});
		})
	});
}

function load_user() {
	/* Sum of score */
	let sum = 0;
	let scores = [0,0,0,0,0,0];
	$.each(user_data, function(index, val) {
		sum += val.score;
		++scores[val.score];
	});

	/* Score bars */
	let obj = document.getElementsByClassName("score-bar-count");
	let max = Math.max(...scores.slice(1));
	for (let i = 1; i <= obj.length; ++i) {
		obj[obj.length-i].style.width = `${scores[i] * 100 / max}%`;
	}
	
	/* Total users */
	let user_len = Object.keys(user_data).length - scores[0]; // Exclude user with no score
	document.getElementById("review-count").innerHTML = `(${user_len})`;

	/* Average score */
	let avg_score = 0;
	if (user_len) {
		avg_score = Math.round(10 * sum / user_len) / 10;
	}
	obj = document.getElementsByClassName("average-score");
	for (let i = 0; i < obj.length; ++i) {
		obj[i].innerHTML = avg_score.toFixed(1);
	}
	localStorage.setItem("avg_score", avg_score);

	/* Hearts */
	for (let i = 0; i <= avg_score; ++i) {
		heart = `.info-heart:nth-child(${i+1}), .review-heart:nth-child(${i})`;
		$(heart).attr('src','./image/red_heart.png');
	}
	
}



/******************************************************************/
/* Raw function */

async function __show_and_upload_image(_temp_id, e) {
	let photo = await downscaleImage(e.target.result);
	concat_image(_temp_id, PROFILE_PIC, photo);

	$.post("./upload_image", {
		user_id: 	USER_ID,
		dog_id:		dog_page_id,
		photo: 		photo
	}, (image_id) => { // change _temp_id to image_id returned by db
		$(`#image_${_temp_id}`)[0].id = `image_${image_id}`;
	});
}

function __generate_comment_section_html(comment_id, user_id, comment, photo) {
	const cmt_id = "comment_" + comment_id;
	const cmtpic_id = "cmtpic_" + comment_id;
	const content_id = "content_" + comment_id;
	const btn_dlt_id = "btn_dlt_" + comment_id;
	const btn_edit_id = "btn_edit_id" + comment_id;
	const option_id = "cmt_option_" + comment_id;
	const user = user_data[user_id];

	$(`<div class=\"user-comment\" id=${cmt_id}>`).prependTo('.comments');
	let txt = "";

	/* User name and profile pic */
	txt += 	"<div class=\"w-user-bar\">";
	txt += 		`<img class=\"profile-avatar\" src=${user.profile}>`;
	txt += 		`<div class=\"username\" style=\"display: block;\">${user.name}</div>`;

	if (user_id == USER_ID) {
		txt += 	`<div class=\"cmt-btn\" onclick=\'(function(){document.getElementById(\"${option_id}\").classList.toggle(\"show\");})();'>AA`;
		txt += 		`<span class=\"cmt-option\" id=${option_id}>`;
		txt += 			`<button class=\"cmt-dlt-btn\" id=${btn_dlt_id}>刪除</button>`;
		txt += 			"<hr class=\"cmt-btn-ln\">";
		txt += 			`<button class=\"cmt-edit-btn\" id=${btn_edit_id}>編輯</button>`;
		txt += 		"</span>";
		txt += 	"</div>";
	}

	txt += 	"</div>";

	/* User score */
	txt += 	"<div class=\"comment-score\">"
	let i;
	for (i = 0; i < user.score; ++i) {
		txt += "<img style=\"width:4.5%\" src=\"./image/red_heart.png\">"
	}
	for(; i < 5; ++i) {
		txt +=  "<img style=\"width:4.5%\" src=\"./image/gray_heart.png\">"
	}
    txt +=	"</div>"

	/* User comment */
	txt +=	`<div class=\"comment\" id=${content_id}>${comment}</div>`;
	txt +=  `<img class=\"comment-pic\" id=${cmtpic_id} src=${photo}></img>`;

	$(`#${cmt_id}`).html(txt);
}

function __generate_comment_buttons(comment_id, user_id, comment, photo) {
	let content_id = "content_" + comment_id;
	let btn_dlt_id = "btn_dlt_" + comment_id;
	let btn_edit_id = "btn_edit_id" + comment_id;
	let user = user_data[user_id];

	/* Add delete button function */
	$(`#${btn_dlt_id}`).click(function () {
		const promise = new Promise((resolve, reject) => {
			$.post("./delete_comment", {
				user_id:	USER_ID,
				comment_id: comment_id,
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
		SCORE = user.score;

		$('.comment-container').hide();
		$('.writing-container').show();
		for (i = 1; i <= 5; i++) {
			hid = `.w-heart:nth-child(${i})`;
			(i <= SCORE)
			? $(hid).attr('src','./image/red_heart.png')
			: $(hid).attr('src','./image/heart.png')
		}

		$('.commentBox').val($(`#${content_id}`)[0].innerHTML);
		$('.preview-pic')[0].src = photo;
	});
}
let comment_id = 0;
let image_id = 0;
let user_data = "";
let IS_EDITING = false;
let editing_comment_id = 0;
let blank_pic = "https://upload.wikimedia.org/wikipedia/commons/c/ca/1x1.png";

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


	user_data[USER_ID].score = SCORE;

	if (!IS_EDITING) { // write a new comment
		concat_comment(++comment_id, USER_ID, $('.commentBox').val(), $('.preview-pic')[0].src);
	}
	
	$.post('./update_users', {
		id: 		USER_ID,
		name:		USER_NAME,
		profile:	PROFILE_PIC,
		score:		SCORE
	}, () => {});

	const promise = new Promise((resolve, reject) => {
		$.post('./post_comment', {
			comment_id: IS_EDITING? editing_comment_id : comment_id,
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

	IS_EDITING = false;
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


	// <div class="cmt-btn" onclick="myFunction()">Button
	// 	<span class="cmt-option" id="cmt-option_000">
	// 		<button class="cmt-edit-btn" id="btn_edit_000">編輯評論</button>
	// 		<hr class="cmt-btn-ln">
	// 		<button class="cmt-dlt-btn" id="btn_dlt_000">刪除</button>
	// 	</span>
	// </div>


	
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
			IS_EDITING = true;
			SCORE = user.score;

			$('.comment-container').hide();
			$('.writing-container').show();
			for (i = 1; i <= 5; i++){
				hid = `.w-heart:nth-child(${i})`;
				if (i <= SCORE) {
				  $(hid).attr('src','./image/red_heart.png');
				}
				else {
				  $(hid).attr('src','./image/heart.png');
				}
			}

			$('.commentBox').val($(`#${content_id}`)[0].innerHTML);
		});

	}
}

function load_comment() {
	$.post("./load_comments", (cmt_json) => {
		
		/* load the scores without review */
		// let score_only = 0;
		// $.each(user_data, function(index, val) {
		// 	if (val.hasOwnProperty("score_only")) {
		// 		concat_comment(score_only++, index, "", "");
		// 	}
		// });

		/*
		 * To ensure all [comment_id] are unique,
		 * the newer comment will always have the bigger [comment_id].
		 */
		$.each(JSON.parse(cmt_json), function(index, val) {
			// comment_id = parseInt(index, 10) + score_only;
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
	$(`<span id=${id}>`).prependTo(".pic-grid");

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
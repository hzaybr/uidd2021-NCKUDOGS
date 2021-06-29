// This is dynamically loaded in with "user.js"

const refreshIntervalId = setInterval(logged_in, 100);

function logged_in() {

    // Try until dog.js finish loading page
    if (!PAGE_LOAD_COMPLETE) return;

    clearInterval(refreshIntervalId);

    const promise = new Promise((resolve, reject) => {
        $.post('./get_liked_images', {user_id: USER.id}, (liked) => {
            var arr = [];
            if (liked) {
                arr = liked.split(',').map(function(num) {
                    return parseInt(num);
                });
            }
            resolve(arr);
        });
    })

    promise.then(arr => {
        arr.forEach(id => {
            if ($(`#liked_btn_${id}`)[0]) {
                $(`#liked_btn_${id}`)[0].src = "./image/like.png";
            }
        });
    })

    $.post('./get_user_photo_ids', {dog_id: dog_page_id, user_id: USER.id}, ids => {
        ids.forEach(id => {
            attach_image_event(id);
        })
    });

    $.post('./get_user_comment_ids', {dog_id: dog_page_id, user_id: USER.id}, ids => {
        ids.forEach(id => {
            attach_comment_button(id);
        })
    })
}

$('.add-pic').off();

$('.heart').off();
$('.heart').click(function() {
    $('.pop-com').fadeIn();
    SCORE = $(this).attr('id')[1];

    /* Hearts in writing container */
    for (i = 1; i <= 5; ++i) {
        hid = $(`.heart:nth-child(${i+1})`);
        (i <= SCORE)
        ? hid.attr('src','./image/red_heart.png')
        : hid.attr('src','./image/heart.png');
    }
});



/************************************************************************************************/
/* Comments */

document.getElementById("post-pic-in-comment").addEventListener("change", add_pic_to_comment);

async function add_pic_to_comment() {
	if (this.files && this.files[0]) {
        var FR = new FileReader();     
        FR.addEventListener("load", async function(e) {
			var photo = await downscaleImage(e.target.result);
			$('.preview-pic')[0].src = photo;
        });

        var blob = await get_image_blob(this.files[0]);
		FR.readAsDataURL(blob);
    }
}

$('.write-com').click(function() {

	$('#writing-post-btn').off();
	$('#writing-post-btn').click(function(){ post_comment(); });

	$('.comment-container').hide();
	$('.writing-container').show();
	for (i = 1; i <= 5; i++) {
		hid = $(`.w-heart:nth-child(${i})`);
		(i <= SCORE)
		? hid.attr('src','./image/red_heart.png')
		: hid.attr('src','./image/heart.png');
	}
});

$('#post-btn').click(post_comment);

function post_comment() {
	user_data[USER.id].score = SCORE;

	$.post('./post_comment', {
		score:		SCORE,
		user_id:	USER.id,
		dog_id:		dog_page_id,
		comment:	$('.commentBox').val(),
		photo:		$('.preview-pic')[0].src
	}, (data) => {
    let comment_id = data["MAX(id)"]
		concat_comment(comment_id, USER.id, $('.commentBox').val(), $('.preview-pic')[0].src, data.timestamp);
		attach_comment_button(comment_id);
		hide_commentBox();
    load_score();
	});
}

function edit_comment(id) {

	$.post('./edit_comment', {
		comment_id: id,
		comment:	$('.commentBox').val(),
		photo:		$('.preview-pic')[0].src,
		score:		SCORE
	});

	$(`#content_${id}`)[0].innerHTML = $('.commentBox').val();
	$(`#cmtpic_${id}`)[0].src = $('.preview-pic')[0].src;
	
	for (i = 1; i <= 5; i++) {
		hid = $(`#comment_${id} .comment-score`)[0].childNodes[i-1];
		(i <= SCORE)
		? hid.src = "./image/red_heart.png"
		: hid.src = "./image/gray_heart.png";
	}

	hide_commentBox();
}

function attach_comment_button(id) {
	const comment_id = "comment_" + id;
	const btn_dlt_id = "btn_dlt_" + id;
	const btn_edit_id = "btn_edit_id" + id;
	const cmtpic_id = "cmtpic_" + id;
	const option_id = "cmt_option_" + id;
	const content_id = "content_" + id;
	const cmt_id = "comment_" + id;

	/* Generate elements */
	var txt = "";
	txt += 	`<div class="cmt-btn" onclick='(function(){document.getElementById("${option_id}").classList.toggle("show");})();'>AA`;
	txt += 		`<span class=\"cmt-option\" id=${option_id}>`;
	txt += 			`<button class=\"cmt-dlt-btn\" id=${btn_dlt_id}>刪除</button>`;
	txt += 			"<hr class=\"cmt-btn-ln\">";
	txt += 			`<button class=\"cmt-edit-btn\" id=${btn_edit_id}>編輯</button>`;
	txt += 		"</span>";
	txt += 	"</div>";
	$(txt).appendTo(`#${comment_id} .w-user-bar`);

	/* Add delete button function */
	$(`#${btn_dlt_id}`).click(function () {
		$.post("./delete_comment", {comment_id: id});

		const cmt = $(`#${cmt_id}`)[0];
		cmt.parentNode.removeChild(cmt);
	});

	/* Add edit button function */
	$(`#${btn_edit_id}`).click(function () {

		/* Attach post comment function */
		$('#writing-post-btn').off();
		$('#writing-post-btn').click(function() {
			edit_comment(id);
		});

		/* Switch page to writing-container */
		$('.comment-container').hide();
		$('.writing-container').show();
		$('.commentBox').val($(`#${content_id}`)[0].innerHTML);
		$('.preview-pic')[0].src = $(`#${cmtpic_id}`)[0].src;
		for (i = 1; i <= 5; i++) {
			var hid = $(`.w-heart:nth-child(${i})`);
			(i <= SCORE)
			? hid.attr('src','./image/red_heart.png')
			: hid.attr('src','./image/heart.png')
		}
	});
}



/************************************************************************************************/
/* Images */

document.getElementById("fl_file").addEventListener("change", upload_image);
document.getElementById("fl_file2").addEventListener("change", upload_image);

async function upload_image() {
    if (this.files && this.files[0]) {
		var FR = new FileReader();     
		FR.addEventListener("load", async function(e) {
			var photo = await downscaleImage(e.target.result);
		
			$.post("./upload_image", {
				user_id: 	USER.id,
				dog_id:		dog_page_id,
				photo: 		photo
			}, (image_id) => {
				concat_image(image_id, USER.profile, photo);
				attach_image_event(image_id);
			});
		});
        
		var blob = await get_image_blob(this.files[0]);
		FR.readAsDataURL(blob);
	}
}

function attach_image_event(id) {
	$(`#image_${id}`).click(function() {
		const img = this;
		$('.pic-del-btn').show();

		$('.real-pic-del-btn').off();
		$('.real-pic-del-btn').click(function() {
			$.post("./delete_image", {image_id: id});
			img.parentNode.removeChild(img);
			hide_blur_white();
		});
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

function get_image_blob(file) {

	return new Promise((res, rej) => {
		heic2any({
			blob: file,
			toType: "image/jpeg",
			quality: 0.1
		})
		.then((result) => { // result is a BLOB of the JPG formatted image
			res(result);
		})
		.catch((errorObject) => {
			if (errorObject.code === 1) { // file is not HEIC 
				res(file);
			} else { // other errors
				rej(errorObject);
			}
		});
	})
}

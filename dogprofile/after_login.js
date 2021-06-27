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
	}, (comment_id) => {
		concat_comment(comment_id, USER.id, $('.commentBox').val(), $('.preview-pic')[0].src);
		attach_comment_button(comment_id);
		hide_commentBox();
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



/************************************************************************************************/
/* Images */

document.getElementById("fl_file").addEventListener("change", upload_image);
document.getElementById("fl_file2").addEventListener("change", upload_image);

const FR = new FileReader();
FR.addEventListener("load", async function(e) {
	let photo = await downscaleImage(e.target.result);

	$.post("./upload_image", {
		user_id: 	USER.id,
		dog_id:		dog_page_id,
		photo: 		photo
	}, (image_id) => {
		concat_image(image_id, USER.profile, photo);
		attach_image_event(image_id);
	});
});

function upload_image() {

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
		? FR.readAsDataURL(file)		// file is not HEIC
		: console.error(errorObject);	// other errors
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
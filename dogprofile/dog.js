var hide_class
const container_list = ['.intro-container', '.pic-container', '.comment-container', '.report-container']
const scrollbar_position = ['10vw', '32.5vw', '55vw', '77.5vw']

let SCORE = 0;
let PAGE_LOAD_COMPLETE = false;
let user_data = {};
const BLANK_PIC = "https://upload.wikimedia.org/wikipedia/commons/c/ca/1x1.png";
const LOADING_PIC = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACXBIWXMAAAsSAAALEgHS3X78AAAAG3RFWHRTb2Z0d2FyZQBDZWxzeXMgU3R1ZGlvIFRvb2zBp+F8AAAADUlEQVQI12M8d+7cfwAIRwNrXorEqAAAAABJRU5ErkJggg=="
const LIKED = "./image/like.png";
const UNLIKED = "./image/unlike.png";

$('html').click(function(e) {
  if(!$(e.target).hasClass('cmt-btn'))
  {
    let elements = document.getElementsByClassName("cmt-option");
    for (let i = 0; i < elements.length; ++i) {
      elements[i].classList.remove("show");
    }
  }
});


$('.start-button').click(function() {
  $(this).css('color','black');
  to = $(this).attr('id')[1];  //id: from, to
  show = container_list[to];
  //console.log(`show ${show}`);
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
    //console.log(`hide ${hide}, show ${show}`);
    yellow = `#${to+to}`;
    //console.log(yellow);

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
	$('.unlogin').fadeIn(500);
});

$('.unlogin').click(function(){
	$('.unlogin').fadeOut(500);
})

$('.add-pic').click(function(e){
    e.preventDefault();
    $('.unlogin').fadeIn(500);   
})

$('#cancel-btn').click(function() {
  $('.pop-com').hide();
  $('.heart').attr('src','./image/heart.png');
});

$('#writing-cancel-btn').click(hide_commentBox);

function hide_commentBox() {
	$('#writing-post-btn').off();
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

/*** link buttons ***/
$('.navig').click(function() {
  localStorage.setItem("navig id", dog_page_id);
  window.location.assign("index.html");
});
$('.XXicon').click(function() {
  localStorage.setItem("dog page id", 50)
  window.location.assign("index.html");
});
$('.mesng-icon').click(function() {
	window.open('https://m.me/ncku.vdogs');
});
$('#re2').click(function() {
  window.open("http://serv-oga.ncku.edu.tw/p/412-1057-6752.php?Lang=zh-tw")
})
$('#re3').click(function() {
  window.open("https://docs.google.com/forms/d/e/1FAIpQLSeh8Q3FbGZkLZytGUlgKfhi-hqgKn1UpJp49Ya8DEZ2A0pkBA/viewform")
})
$('#re4').click(function() {
  window.open('https://www.facebook.com/ncku.vdogs')
})

/*** load intro from dog.json ***/
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


/*** click image ***/
$('.pic-grid').on('click', '.image-image', function(){
  id = $(this).attr('id').slice(6)
  const promise = new Promise((resolve,reject) =>{
    $.post('/get_image', {
      image_id: id
      }, (data)=>{
        $('.click-avatar').html(`<img class="profile-avatar" style="width: 11vw; height:11vw" src="${data.profile}">`)
        $('.click-name').html(`<p>${data.name}</p>`)
        $('.pictitle').html(`<p>${data.title}</p>`)
        $('.photo').html(`<img class="click_photo" src="${data.photo}">`)
        $('#heart-count').html(`<p>${data.likes}個愛心</p>`)
        $('.click-heart').show()
        $('.click-heart').attr('id', `clk_btn_${id}`)
        $('#time').show()
        resolve(data.timestamp)
      })
  })
  promise.then((time) =>{
    $.post('/load_time', {
      }, (time_now) => {
          time_txt = caculate_time(time, time_now)
          $(`#time`).html(`<p>${time_txt}</p>`)
    })
  $('.blur-white').show();
  })
})

$('.pic-arrow').click(hide_blur_white);

function hide_blur_white() {
	$('.blur-white').hide()
	$('.photo img').remove()
	$('.click-avatar img').remove()
	$('.click-name p').remove()
	$('.pictitle p').remove()
	$('.click-heart').hide()
  	$('.click-heart').attr('id','')
	$('#time p').remove()
	$('.pic-del-btn').hide();
  	$('.real-pic-del-btn').hide()
}

function caculate_time(time, time_now) {
  time = time.replace(/-/g, '/')
  time_now = time_now.replace(/-/g, '/')

  t = new Date(time)
  t1= Date.parse(time)
  t2 = Date.parse(time_now)
  
  second_dif = parseInt((t2-t1)/1000);
  if(second_dif >=60){
    minute_dif = parseInt(second_dif/60)
    if(minute_dif >=60){
      hour_dif = parseInt(minute_dif/60)
      if(hour_dif>=24){
        day_dif = parseInt(hour_dif/24)
        if(day_dif>=30){
          month_dif = parseInt(day_dif/30)
          if(month_dif>12)
            time_txt = `${t.getFullYear()}年${t.getMonth()+1}月${t.getDate()}日` 
          else
            time_txt = `${t.getMonth()+1}月${t.getDate()}日`
        }
        else if(day_dif>=7 && day_dif<30)
          time_txt = `${parseInt(day_dif/7)}週前`
        else
          time_txt = `${day_dif}天前`
      }
      else
        time_txt = `${hour_dif}小時前` 
    }
    else
      time_txt = `${minute_dif}分鐘前`
  }
  else
    time_txt = `${second_dif}秒前`

  return time_txt
}

/*
$('#comment_box').on('click', '.profile-avatar, .com-username', function() {
  let id = $(this).attr('id').slice(4)
  id = btoa(id)
  window.location.assign(`userprofile.html?com=${id}`)
})
*/

/************************************************************************************************/

$(function() {

	/* Initialize image and comment section */
	const promise = new Promise((resolve, reject) => {
		$.post('./load_users', {dog_id: dog_page_id}, (user_json) => {
			user_data = JSON.parse(user_json);
			resolve(user_data);
		});
	});

	load_score();
	promise.then((value) => {
		Promise.all([load_image(), load_comment()]).then(values => {
			PAGE_LOAD_COMPLETE = true;
		});
	});

});

function concat_comment(comment_id, user_id, comment, photo, timestamp) {
	__generate_comment_section_html(comment_id, user_id, comment, photo);
	load_time(comment_id, timestamp)
}

let load_complete = false;
function load_comment() {
	return new Promise((res, rej) => {
		$.post('./load_comments', {dog_id: dog_page_id}, (cmt_json) => {
			$.each(JSON.parse(cmt_json), function(index, val) {
				concat_comment(index, val.user_id, val.comment, val.photo, val.timestamp);
			});
			load_complete = true;
			res('comment_loaded');
		});
	});
}

function load_time(index, time) {
  $.post('/load_time', {
    }, (time_now) => {
        time_txt = caculate_time(time, time_now)
        $(`#time_${index}`).html(time_txt)
  })
}

async function concat_image(image_id, user_pic, photo) {
	const id = "image_" + image_id;
	const img_btn_id = "liked_btn_" + image_id;
	const clk_btn_id = "clk_btn_" + image_id;
	$(`<span class=\"image-image\" id=${id}>`).prependTo(".pic-grid");

	let txt = "";
	/* user profile pic */
	txt += 	`<div class="user-pic-for-image">`;
	txt += 		`<img class="profile-avatar" src=${user_pic} width=100%>`;
	txt += 	"</div>";

	/* like button */
	txt +=	`<div class="photo-like">`;
	txt +=		`<img id=${img_btn_id} class="photo-like-heart-button" src="./image/unlike.png" width=10%>`;
	txt +=	`</div>`;

	/* photo */
	txt += 	`<img class="image-grid-image" src=${photo} width=100% height=100%>`;

	$(`#${id}`).html(txt);

	$(`#${id}`).click(function () {
		$(".click-heart")[0].src = $(`#${img_btn_id}`)[0].src;
	});

	/* add like button function */
	$(`#${img_btn_id}`).click(function () {
		if(login_status) {
			$.post('./like_image', {
				user_id:	USER.id,
				image_id:	image_id
			});

			var src = document.getElementById(img_btn_id).getAttribute('src');
			(src === LIKED)
			? $(`#${img_btn_id}`)[0].src = UNLIKED
			: $(`#${img_btn_id}`)[0].src = LIKED;

			return false;
		}
		else {
			$('.unlogin').fadeIn(500);
			return false;
		}
  	});
}

function load_image() {

	return new Promise((res, rej) => {
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
	
		promise.then(id_arr => {	
			id_arr.forEach(index => {
				$.post('./query_image', {id: index}, (image) => {
					image = JSON.parse(image);
					$(`#image_${image.id} .profile-avatar`)[0].src = user_data[image.user_id].profile;
					$(`#image_${image.id} .image-grid-image`)[0].src = image.photo;
				});
			})
			res('image_loaded');
		});

	});	
}

function load_score() {

	$.post('./get_scores', {dog_id: dog_page_id}, scores => {

		/* Sum of score */
		let sum = 0;
		for (var i = 1; i <= 5; ++i) {
			sum += scores[i] * i;
		}

		/* Score bars */
		let obj = document.getElementsByClassName("score-bar-count");
		let max = Math.max(...scores.slice(1));
		if(max) {
			for (let i = 1; i <= obj.length; ++i) {
				obj[obj.length-i].style.width = `${scores[i] * 100 / max}%`;
			}
		}
		
		/* Total users */
		let user_len = scores.reduce((a,b) => a+b);
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

	});
}



/******************************************************************/
/* Raw function */

function __generate_comment_section_html(comment_id, user_id, comment, photo) {
	const cmt_id = "comment_" + comment_id;
	const cmtpic_id = "cmtpic_" + comment_id;
	const content_id = "content_" + comment_id;
	const time_id = "time_" + comment_id;
	const user = user_data[user_id];

	$(`<div class=\"user-comment\" id=${cmt_id}>`).prependTo('.comments');
	let txt = "";

	/* User name and profile pic */
	txt += 	`<div class="w-user-bar">`;
	txt += 		`<img class=\"profile-avatar b-profile\" id="ava_${comment_id}" src=${user.profile}>`;
	txt += 		`<div class=\"name-title\" style="display: block;">`
	txt +=      	`<p class="com-username" id="nam_${comment_id}">${user.name}</p>`
	txt +=      	`<p class="title">${user.title}</p>`
	txt +=  	`</div>`;
	txt += 	`</div>`;

	if (user_id == USER.id) {
		SCORE = user.score;
	}

	/* User score */
	txt += 	"<div class=\"comment-score\">"
	let i;
	for (i = 0; i < user.score; ++i) {
		txt += "<img style=\"width:100%\" src=\"./image/red_heart.png\">"
	}
	for(; i < 5; ++i) {
		txt +=  "<img style=\"width:100%\" src=\"./image/gray_heart.png\">"
	}
	txt +=    `<div class="cmt-time" id="${time_id}"></div>`
	txt +=	"</div>"

	/* User comment */
	txt +=	`<div class=\"comment\" id=${content_id}>${comment}</div>`;
	txt +=  `<img class=\"comment-pic\" id=${cmtpic_id} src=${photo}></img>`;

	$(`#${cmt_id}`).html(txt);
}

function reload_comment() {
	var x = document.getElementsByClassName("user-comment");
	for(var i = x.length - 1; i >= 0; i--) {
		x[i].parentNode.removeChild(x[i]);
	}
	load_comment();
}

const container_list = ['.comment-container', '.pic-container', '.gps-container']
const scrollbar_position = ['15vw', '43.1vw', '71.5vw']
const dog_name = ['豆皮','小小乖','跳跳','皮蛋','白米','米香','麵線','呆呆','阿勇','小武','阿貴','奶茶','豆豆','仙草','黑熊','豆腐','北極熊','棕熊','拉拉'];
const lat_bn = [22.9922, 22.9958, 23.001, 23.002]
const lng_bn = [120.2142, 120.218, 120.2220, 120.225]


$('.button').click(function() {
  from = $(this).attr('id')[0];
  to = $(this).attr('id')[1];

  if(from!=to){
    $(this).css('color','black');
    hide = container_list[from];
    show = container_list[to];
    yellow = `#${to+to}`;

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

$('.pic-grid').on('click', '.grid-photo', function(){
  id = $(this).attr('id').slice(6)
  const promise = new Promise((resolve,reject) =>{
    $.post('./get_image', {
      image_id: id,
      }, (data)=>{
        $('.dog-pic').attr('id', `dog_${data.dog_id}`)
        $('.dog-pic').html(`<img width="88%" src="./image/dog/${data.dog_id}.png">`)
        $('.dog-name').html(`<p>${dog_name[data.dog_id]}</p>`)
        $('.dog-name p').attr('id', `dog_${data.dog_id}`)
        $('.photo').html(`<img class="click_photo" src="${data.photo}">`)
        $('#click-heart').show();
        (data.likes === 0)
          ? img = './image/unlike.png'
          : img = './image/like.png';

        $('#click-heart').attr('src', img)
        $('#heart-count').html(`<p>${data.likes}個愛心</p>`)
        $('#time').show()
        resolve(data.timestamp)
      })
  })
  promise.then((time) =>{
    $.post('/load_time', {
      }, (time_now) => {
          time = preprocess_time(time)
          time_txt = caculate_time(time, time_now)
          $(`#time`).html(time_txt)
    })
  $('.blur-white').show();
  })
})

$('.comment-grid').on('click', '.dogname, .dogavatar', directToDogpage);
$('.locate-grid').on('click', '.l-name, .dogavatar', directToDogpage);
$('.dog-name-pic').on('click', '.dog-pic, .dog-name p', directToDogpage);


function directToDogpage() {
  let id = $(this).attr('id').slice(4)
  console.log(id)
  localStorage.setItem('dog page id', id)
  window.location.assign('dog.html')
}
$('.arrow').click(function() {
  $('.blur-white').hide()
  $('.photo img').remove()
  $('.dog-pic img').remove()
  $('.dog-name p').remove()
  $('#time').hide()
  $('#click-heart').hide()
});

/**************************************************************************/
var comment, dog_id, photo
var cmt_txt, p_txt
var pic_len

function load_profile_detail() {
  var len
  var times = []
  var ptimes = []
  document.title = `${USER_NAME}｜汪汪`;
  $('.top-name').html(USER_NAME);

  const promise = new Promise((resolve, reject) => {
    $.post('/load_score',{
      userID: USER_ID
      },(data)=>{
        resolve(Object.values(data))
        });
   });
  promise.then((scores) =>{
    p = new Promise((resolve, reject) => {
      $.post('/load_profile_cmt', {
      userID: USER_ID
      }, (data) =>{
        len = Object.keys(data).length-1
        cmt_txt = ""
        for(var i=len; i>=0; i--){
          comment = data[i].comment
          dog_id = data[i].dog_id
          photo = data[i].photo
          times.push(data[i].timestamp)
          load_cmt(scores, i)
        }
        resolve(times)
        $('.comment-grid').html(cmt_txt);
      })
    })

    p.then((times) =>{
      $.post('/load_time', {
        }, (time_now) => {
          for(var i=len;  i>=0; i--) {
            time = preprocess_time(times[i])
            time_txt = caculate_time(time, time_now)
            $(`#time${len-i}`).html(time_txt)
          }
        })
    })

  })

  $.post('/load_profile_img', {
    userID: USER_ID
  }, (data) =>{
    load_img(data)
  })

  const promise_g = new Promise((resolve, reject) => {
    $.post('/load_profile_position', {
      userID: USER_ID
    }, (data) =>{
        load_location(data)
        resolve(data)
    })
  })
  promise_g.then((data) => {
    len = Object.keys(data).length-1
    pg = new Promise((resolve, reject) =>{
      for(var i=len; i>=0; i--){
        caculate_lct(data[i].lat, data[i].lng, i)
        ptimes.push(data[i].timestamp)
      }
      resolve(ptimes)
    })
    pg.then((ptimes) => {
      $.post('/load_time', {
        }, (time_now) => {
          for(var i=len;  i>=0; i--) {
            time_txt = caculate_time(ptimes[i], time_now)
            $(`#l_time_${len-i}`).html(time_txt)
          }
      })
    })
  })
}


function load_cmt(scores, num){
  cmt_txt += `<div class="c-border">`
  cmt_txt += `<div class="c-grid">`
  cmt_txt +=   `<img class="dogavatar" id="dog_${dog_id}" width="90%" src="./image/dog/${dog_id}.png">`
  cmt_txt +=   `<div class="cmt-sub-grid">`
  cmt_txt +=     `<div>`
  cmt_txt +=       `<p class="dogname" id="dog_${dog_id}">${dog_name[dog_id]}</p>`
  cmt_txt +=       `<p class="dtime" id="time${num}"></p>`
  cmt_txt +=     `</div>`
  cmt_txt +=     `<div class="heart-grid" id=${dog_id}>`
  var dog_score = scores[dog_id]
  for(i=0; i<dog_score; i++){
    cmt_txt +=     `<img class="heart" src="./image/red_heart.png">`
  }
  for(; i<5; i++){
    cmt_txt +=     `<img class="heart" src="./image/gray_heart.png">`
    }
  cmt_txt +=     `</div>`
  cmt_txt +=     `<p style="margin:1vw;font-size:4.4vw;">${comment}</p>`
  cmt_txt +=   "</div>"
  cmt_txt +=   "</div>"
  cmt_txt += `<img src="${photo}" style="max-width: 100%">`
  cmt_txt += "</div>"
};

function load_img(photos) {
    p_txt = ""
    pic_len = Object.keys(photos).length
    var row = pic_len%3 + 1
    console.log(`pic row: ${row}`)
    $('.pic-grid').css("grid-template-rows", `repeat(${row}, 33.1vw)`)
    for(var i=pic_len-1; i>=0; i--){
      p_txt += `<div class="grid-photo" id="image_${photos[i].id}" style="background-image: url(${photos[i].photo});"></div>`
    }
    $('.pic-grid').html(p_txt);
};

function load_location(data) {
  len = Object.keys(data).length-1
  for(var i=len; i>=0; i--){
    txt = `<div class="l-border">`
    txt += `  <div class="l-grid">`
    txt += `    <img class="dogavatar" id="dog_${data[i].dog_id}" width=100% src="./image/dog/${data[i].dog_id}.png">`
    txt += `    <p class="l-name" id="dog_${data[i].dog_id}">${dog_name[data[i].dog_id]}</p>`
    txt += `    <div class="location" id="loc_${i}"></div>`
    txt += `    <div class="l-time" id="l_time_${i}"></div>`
    txt += `  </div>`
    txt += `</div>`
    $('.locate-grid').append(txt)
  }
}

function caculate_lct(lat, lng, id){
  lat = parseFloat(lat)
  lng = parseFloat(lng)
  console.log(lat,lng)
  n = ""
  for(i=0; i<3; i++){
    if(lat>lat_bn[i] && lat<lat_bn[i+1]){
      n += i.toString()
      break
    }
  }
  for(i=0; i<3; i++){
    if(lng>lng_bn[i] && lng<lng_bn[i+1]){
      n += i.toString()
      break
    }
  }
  switch(n){
    case '10': n_txt = "光復校區"; break;
    case '20': n_txt = "力行校區"; break;
    case '01': n_txt = "勝利校區"; break;
    case '11': n_txt = "成功校區"; break;
    case '21': n_txt = "成杏校區"; break;
    case '02': n_txt = "東寧校區"; break;
    case '12': n_txt = "自強校區"; break;
    case '22': n_txt = "敬業校區"; break;
    default: n_txt = "成大校園";
  }

  $(`#loc_${id}`).html(n_txt)
}

function preprocess_time(time) {
  time = time.replace(/-/g, '/')
  t1= Date.parse(time)
  return t1
}
function caculate_time(time, time_now) {
  time_now = time_now.replace(/-/g, '/')

  t = new Date(time)
  t1 = time
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

const container_list = ['.comment-container', '.pic-container', '.gps-container']
const scrollbar_position = ['15vw', '43.1vw', '71.5vw']
const dog_name = ['豆皮','小小乖','跳跳','皮蛋','白米','米香','麵線','呆呆','阿勇','小武','阿貴','奶茶','豆豆','仙草','黑熊','豆腐','北極熊','棕熊','拉拉'];


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


/**************************************************************************/
var comment
var dog_id
var times = []
var cmt_txt, p_txt

$(document).ready(function() {
  var len
  document.title = `${USER_NAME}｜汪汪`;

  const promise_s = new Promise((resolve, reject) => {
    $.post('/load_score',{
      userID: USER_ID
      },(data)=>{
        resolve(Object.values(data))
        });
   });
  promise_s.then((scores) =>{
    p = new Promise((resolve, reject) => {
      $.post('/load_profile_cmt', {
      userID: USER_ID
      }, (data) =>{
        len = Object.keys(data).length-1
        cmt_txt = ""
        for(var i=len; i>=0; i--){
          comment = data[i].comment
          dog_id = data[i].dog_id
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
            time_txt = caculate_time(times[i], time_now)
            $(`#time${len-i}`).html(time_txt)
          }

      })
    })
  })

    $.post('/load_profile_img', {
      userID: USER_ID
    }, (data) =>{
      console.log('load img')
      load_img(data)
    })

})


function load_cmt(scores, num){
  cmt_txt += `<div class="c-border">`
  cmt_txt +=   `<img width="100%" src="./image/dog/${dog_id}.png">`
  cmt_txt +=   `<div class="cmt-sub-grid">`
  cmt_txt +=     `<div class="name-time">`
  cmt_txt +=       `<p class="dogname">${dog_name[dog_id]}</p>`
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
  cmt_txt +=     `<p style="margin:1vw;font-size:3.9vw;">${comment}</p>`
  cmt_txt +=   "</div>"
  cmt_txt += "</div>"
};

function load_img(photos) {
    p_txt = ""
    var pic_num = Object.keys(photos).length
    var row = pic_num%3 + 1
    console.log(`pic row: ${row}`)
    $('.pic-grid').css("grid-template-rows", `repeat(${row}, 33.1vw)`)
    for(var i=pic_num-1; i>=0; i--){
      p_txt += `<div class="grid-photo" style="background-image:url(${photos[i].photo})"></div>`
    }
    $('.pic-grid').html(p_txt);
};

function caculate_time(time, time_now) {
  t1= Date.parse(time)
  t2 = Date.parse(time_now)
  t = new Date(t1)
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

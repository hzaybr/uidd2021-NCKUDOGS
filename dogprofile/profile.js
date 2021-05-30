var hide_class
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
var time
var cmt_txt

$(function() {
  $.post('/load_score', {
    userID: USER_ID,
    },(data) => {
      scores =  Object.values(data)
      var txt = ""
      scores.forEach(function(score, i) {
        if(score != 0){
          txt += `<div class="score_${i}" id=${score}></div>`
          }
          $('.n-score').html(txt)
        })
    })
})

$(document).ready(function(){
  $.post('/load_profile_cmt', {
    userID: USER_ID
    }, (data) =>{
      let len = Object.keys(data).length-1
      cmt_txt = ""

      for(var i=len; i>=0; i--){
        comment = data[i].comment
        dog_id = data[i].dog_id
        time = data[i].timestamp
        load_cmt()
       }
      $('.comment-grid').html(cmt_txt);
    })

})

function load_cmt(){
  cmt_txt += `<div class="c-border">`
  cmt_txt +=   `<img width="80%" src="./image/dog/${dog_id}.png">`
  cmt_txt +=   `<div class="cmt-sub-grid">`
  cmt_txt +=     `<p class="dogname">${dog_name[dog_id]}</p>`
  cmt_txt +=     `<div class="heart-grid" id=${dog_id}>`
  var score = $(`.score_${dog_id}`).attr('id')
  for(i=0; i<score; i++){
    cmt_txt +=     `<img class="heart" src="./image/red_heart.png">`
  }
  for(; i<5; i++){
    cmt_txt +=     `<img class="heart" src="./image/gray_heart.png">`
  }
  cmt_txt +=     `</div>`
  cmt_txt +=     `<p style="margin:1vw;font-size:3.6vw;">${comment}</p>`
  cmt_txt +=   "</div>"
  cmt_txt += "</div>"
};

  
    /*
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

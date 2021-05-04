let cmt_cnt = 0;
let img_cnt = 0;

function concatComment(user, comment) {
	$(`<div class=\"com-border\" id=${user}>`).prependTo('.comments');
	let txt = "<div class=\"heart-grid\">";
	txt += "<img class=\"avatar\" src=\"image/Ellipse 303.png\"></img>";
	txt += `<p>${user}</p>`;
	txt += "</div>";
	txt += `<p>${comment}</p>`;
	$(`#${user}`).html(txt);
}

$(function(){

    $.post("./load_comments", (cmt_json) => {
        $.each(JSON.parse(cmt_json), function(index, val) {
            ++cmt_cnt;
			concatComment(index, val);
        });
	});

    $.post("./load_images", (img_json) => {
        $.each(JSON.parse(img_json), function(index, val) {
            ++img_cnt;
			$(`<img src=\"\" id=${index} width=100%/>`).prependTo(".pic-grid");
            document.getElementById(index.toString()).src = val;
        });
    });

	$('.c-p-button').click(function() {

		if ($('.commentBox').val().length == 0)
			return;

		var comment = $('.commentBox').val();
		concatComment(`user${++cmt_cnt}`, comment);
		$('.commentBox').val('');

		$.post('./post_comment', {
			id: `user${cmt_cnt}`,
			content: comment,
		}, () => {});

		$('.comment-container').fadeIn();
		$('.writing-container').hide();
		$('.w-heart').attr('src','./image/heart.png');
		$('.heart').attr('src','./image/heart.png');
		$('.pop-com').hide();
	});

});

/* convert image to base 64 */
function readFile() {

    if (this.files && this.files[0]) {
    
        var FR = new FileReader();
        
        FR.addEventListener("load", function(e) {
			++img_cnt;
			$(`<img src=\"\" id=${img_cnt} width=100%/>`).prependTo(".pic-grid");
            document.getElementById(img_cnt.toString()).src = e.target.result;

            $.post("./upload_image", {
                id: img_cnt,
                image: e.target.result
            }, () => {});
        });
    
        FR.readAsDataURL( this.files[0] );
    }
}
    
document.getElementById("fl_file").addEventListener("change", readFile);
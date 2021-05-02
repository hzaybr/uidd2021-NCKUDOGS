let cmt_cnt = 0;
let img_cnt = 0;

$(function(){

    $.post("./load_comments", (cmt_json) => {
        $.each(JSON.parse(cmt_json), function(index, val) {
            ++cmt_cnt;
            $('<li>').text(val).prependTo('.comments');
        });
	});

    $.post("./load_images", (img_json) => {
        $.each(JSON.parse(img_json), function(index, val) {
            ++img_cnt;
			$(`<img src=\"\" id=${index} width=100%/>`).prependTo("#imgs");
            document.getElementById(index.toString()).src = val;
        });
    });

	$('button').click(function() {
		var comment = $('.commentBox').val();
		$('<li>').text(comment).prependTo('.comments');
		$('button').attr('disabled', 'true');
		$('.counter').text('140');
		$('.commentBox').val('');

		$.post('./post_comment', {
			id: ++cmt_cnt,
			content: comment,
		}, () => {});
	});
	
	$('.commentBox').keyup(function() {		
		if ($(this).val().length == 0) {
			$('button').attr('disabled', 'true');
		}
		else {
			$('button').removeAttr('disabled', 'true');
		}
	});
	
	$('button').attr('disabled', 'true');
});

/* convert image to base 64 */
function readFile() {

    if (this.files && this.files[0]) {
    
        var FR = new FileReader();
        
        FR.addEventListener("load", function(e) {
			++img_cnt;
			$(`<img src=\"\" id=${img_cnt} width=100%/>`).prependTo("#imgs");
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
$(function() {
    $.post("./load_comments", (cmt_json) => {
		$.each(JSON.parse(cmt_json), function(index, val) {
			comment_id = parseInt(index, 10);
			concat_comment(comment_id, val.user, val.comment, val.photo);
		});
	}); 
});
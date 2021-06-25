// This is dynamically loaded in with "user.js"

const refreshIntervalId = setInterval(logged_in, 100);

function logged_in() {

    // Try until dog.js finish loading page
    if (!PAGE_LOAD_COMPLETE) return;

    clearInterval(refreshIntervalId);

    const promise = new Promise((resolve, reject) => {
        $.post('./get_liked_images', {user_id: USER_ID}, (liked) => {
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

    $.post('./get_user_photo_ids', {dog_id: dog_page_id, user_id: USER_ID}, (ids) => {
        const posted_by_user = new Set(ids.split(','));

        $('.image-image').each((index, pic) => {
            let img_id = pic.id.slice(6);

            if (posted_by_user.has(img_id)) {
                attach_image_event(img_id);
            }
            else {
                $(`#${pic.id}`).click(function() {
                    $('.pic-del-btn').hide();
                })
            }
        })
    });

}
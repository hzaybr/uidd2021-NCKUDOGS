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

}
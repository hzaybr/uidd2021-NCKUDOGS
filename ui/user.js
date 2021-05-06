var address = location.href
console.log(address)
//get user name
let name = address.match(/user=(\W|\w|\z)*&/)[0].slice(5,-1)
name = decodeURI(name)
console.log(`user name: ${name}`)

//get user profile photo (address to download)
let pic_address = address.match(/pic=(\W|\w|\z)*/)[0].slice(4,-1)
pic_address_base64 = decodeURI(pic_address)
pic_address_http = atob(pic_address)
console.log(`pic address: ${pic_address_http}`)

$('.username').attr('id',name)
$('.address_base64').attr('id',pic_address_base64)


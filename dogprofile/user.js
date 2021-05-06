var address = location.href
console.log(address)
//get user name
let name = address.match(/user=(\W|\w|\z)*&/)[0].slice(5,-1)
name = decodeURI(name)
console.log(`user name: ${name}`)

//get user profile photo (address to download)
let pic_address = address.match(/pic=(\W|\w|\z)*/)[0].slice(4,-1)
pic_address = decodeURI(pic_address)
pic_address = atob(pic_address)
console.log(`pic address: ${pic_address}`)

$('.username').attr('id',name)


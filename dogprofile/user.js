var address = location.href
console.log(address)

let name = address.match(/=(\W|\w|\z)*/)[0].slice(1)
name = decodeURI(name)
console.log(name)

$('.username').attr('id',name)

var jsonfile = require('jsonfile');
for (i=0; i <11 ; i++){
  console.log('write')
     jsonfile.writeFile('loop.json', "id :" + i + " square :" + i*i);
   }

console.log('hi...')


var b = ['Other Non-Standard=','No Prior Insurance=','21st Century=','AAA='] //inputfiles
var a = ['No Prior Insurance=','Other Non-Standard=']
var c=  difference(b,a)
console.log(c)

console.log(b.includes('AAA='))

var final = 'setdata|'
var otherdata = 'othervalues'

c.forEach(element => {
    console.log(element);
    final+=element+'='+otherdata
});

console.log(final);

function difference(a1, a2) {
    return a1.filter(x => !a2.includes(x));
  }

  function diff(a1, a2) {
    return a1.concat(a2).filter(function(val, index, arr){
     // return arr.indexOf(val) === arr.lastIndexOf(val);
return arr
    });
  }
  
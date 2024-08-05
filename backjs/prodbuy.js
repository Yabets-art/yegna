document.getElementById('filtername').onchange = function(){
    part('part',this.value)
}
document.getElementById('searchnow').onclick = function(){
    part('byname',null)
}

async function part(type,req){
    req =  req || document.getElementById('searchprod').value;
    var response = await fetchthis("./backjs/php/buyprod.php",{
    method : 'POST',    
    Headers:{
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({buy : {[type] : req}})
    });
    response = JSON.parse(response);
    if(response.info.length == 0 ){return message(0, "coludn`t find any product");}
document.getElementById('result').style.display = "block";
document.getElementById('above').innerHTML = "";
///////////////////////////////// the card is unknow ,there is problem in here  and so i cant  fix it yet :)
((response.info.length == 0)?[response.info]:response.info).forEach(element => {
    makecard(element,"above")
}) 

}

function openprofile(){
    var x = JSON.parse(sessionStorage.getItem('user'));
    document.getElementById('imgid').src = x.userimg;
    document.getElementById('profileName').innerHTML = x.username;
    document.getElementById('profileLocation').innerHTML = x.location;
    document.getElementById('profileEmail').innerHTML = x.email;
    cadd();
}
async function cadd(){
    var response = await fetchthis("./backjs/php/buyprod.php",{
        method : 'POST',    
        Headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({cadd : {userid : JSON.parse(sessionStorage.getItem('user')).id}})
    })
    response = JSON.parse(response);
    var y = document.getElementById('chartmenu');
    y.innerHTML = "";
    response.info.forEach(element => {
      y.appendChild(addbut(element))
    });
}

function addbut(element){
    var x = document.createElement('input');
    x.value = element.prodname || "unknown";
    x.classList.add('chartbut');
    x.type= "button";
    x.onclick = function(){
    document.getElementById('displaye').innerHTML =`
    name : ${element.prodname || "unkown"}<br>
    price : ${element.prductvalue}<br>
    type : ${element.producttype}<br>
    loc : ${element.prodloc}<br>
    descrption : ${element.proddic}
    ` || "nothing found"
    }
    return x
}

refresh('buyandsell',"all",false,false);
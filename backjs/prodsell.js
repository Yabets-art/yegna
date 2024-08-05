async function prodsell() {
    var form = new FormData(document.getElementById('prodsell'));
    var hasNullOrEmpty = [];  
    console.log(Array.from(form))
    form.forEach((value, key) => {
        if (value === null || value === '') {
            keysWithNullOrEmpty.push(key);
        }
    })
    if(hasNullOrEmpty.length > 0 ){
        message(0,'Please fill all the fields');
        return
    }
    try {
        form.append('img',document.getElementById('previewImage').getAttribute('src'))
        var response =await fetchthis('./backjs/php/sellprod.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sell: {user : JSON.parse(sessionStorage.getItem('user')).id, prodsell: Object.fromEntries(form) } })  
        });
        response = JSON.parse(response);
        console.log(response.value);
        if(response.value){
            message(1,response.mesage || 'product posted successfully');
            refresh(null,null,response.info);
        }
        else{
        message(0, response.mesage ||response.alert);
        }
    } catch (error) {
        alert(error)
    }   
}
async function refresh(tablen,type=any,data=false,place=falce){

if(!data){
let id = JSON.parse(sessionStorage.getItem('user')).id 
var response = await fetchthis('./backjs/php/sellprod.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({find : { userid:  id , table : tablen ,  [type] : true } })
});
response = JSON.parse(response);

}
if(data){ return makecard(data)}
if( response.info == null) return;

///////////////////////////////// the card is unknow ,there is problem in here  and so i cant  fix it yet :)
((response.info.length == 0)?[response.info]:response.info).forEach(element => {
    makecard(element,null,place)
}) 

}

function makecard(data,typerq,place=false){
    
var cardContainer = document.getElementById(typerq ||'card-input');
var card = document.createElement('div');
card.classList.add('card');
card.id = 'item' + data[0];


var image = document.createElement('img');
image.classList.add('imgpic');
image.src = data[2] || './logo.jpg';


var valueContainer = document.createElement('div');
valueContainer.classList.add('value');

var productName = document.createElement('h5');
productName.classList.add('pname');
productName.textContent = 'product dicription ';

var description = document.createElement('p');
description.textContent = data[6] || 'something'


var price = document.createElement('h5');
price.classList.add('price');
price.textContent = 'price';


var priceValue = document.createElement('p');
priceValue.textContent = (data[1]|| 'something' ) + "  birr" ;


var type = document.createElement('h5');
type.classList.add('type');
type.textContent = 'type';


var typeValue = document.createElement('p');
typeValue.textContent = data[4] || 'something';

var pname = document.createElement('h5');
pname.classList.add('pname');
pname.textContent = 'product name';

var pnamevalue = document.createElement('p');
pnamevalue.textContent = data[7] || 'something';

var loc = document.createElement('p');
loc.textContent = "loc: " + (  data[5] || 'somewhere');
if(place){
var btn = document.createElement('button');
btn.classList.add('btn');

btn.textContent = 'Delete';
btn.onclick = function(){
    document.getElementById('item' + data[0]).remove();
    sessionStorage.removeItem(data[0]);
    deleteid(data[0]);
}
but2 = document.createElement('button');
but2.classList.add('btn');
but2.textContent = 'Edit';
but2.onclick = function(){
    document.getElementById('item' + data[0]).remove();
    sessionStorage.removeItem(data[0]);
    edit(data[0]);
}
}else{
    var but2 = document.createElement('div');
    but2.id = "di"+data[0];
    var btn = document.createElement('button');
    btn.classList.add('btn');
    btn.id = "btn"+data[0];
    
    btn.textContent = 'Add to Cart';
    btn.onclick = function(){
        addtochart(data[0],"btn"+data[0])
    }

    di = document.createElement('button');
    di.classList.add('btn');
    di.textContent = 'Buy Now';
    di.onclick = function(){
        addtobuy(data)
    }
    but2.appendChild(di);
    }


valueContainer.appendChild(pname);
valueContainer.appendChild(pnamevalue);
valueContainer.appendChild(productName);
valueContainer.appendChild(description);
valueContainer.appendChild(price);
valueContainer.appendChild(priceValue);
valueContainer.appendChild(type);
valueContainer.appendChild(typeValue);
valueContainer.appendChild(loc);
valueContainer.appendChild(but2);
valueContainer.appendChild(btn);

card.appendChild(image);
card.appendChild(valueContainer);

cardContainer.appendChild(card);

}

async function deleteid(id){
 var response =  await fetchthis('./backjs/php/sellprod.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ delete: { id: id } })
    });
    response = JSON.parse(response);
    if(response.value){
        message(1,response.mesage);
    }
    else{
        message(0, response.mesage ||response.alert);
    }
}

function edit(id){
    openForm()
    document.getElementById('butchange').onclick = function(){
        deleteid(id);
        prodsell() 
        document.getElementById('butchange').onclick = prodsell;
    }

}


async function addtochart(id,tagid){
var response =  await fetchthis('./backjs/php/buyprod.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ addtochart: { userid: JSON.parse(sessionStorage.getItem('user')).id, productid : id} })
})
response = JSON.parse(response);
if(response.value){
    message(1, response.mesage);
}
else{
    message(0, " system is not working now");
}
document.getElementById(tagid).innerHTML="Added to Chart";
document.getElementById(tagid).style.backgroundColor = ""
}

async function addtobuy(id){
    var x = document.getElementById("di"+id[0]);
    x.innerHTML = ""
    var v = document.createElement('img');
    v.src = 'https://www.ethiotelecom.et/wp-content/uploads/2021/02/CBE-Birr-01.jpg';
    v.onclick = function(){
        document.getElementById('pay').style.display = "block";
        var code = hashInteger(id[0])
        document.getElementById('payplace').innerHTML =`
        <label class="givename">---CBE Birr---</label> 
        <button onclick="this.parentNode.parentNode.style.display = 'none'" class="close-button">&times;</button>


Booking Reference<br>
Payment Instruction<br>

Amount: ${id[1]}<br>
<fieldset>
  <legend>keep this code safe</legend>
  Order Code: ${code}<br>
</fieldset>


Merchant: Ethiopian Mobile App<br>
Please follow the below instruction and steps to complete the payment using USSD<br>
Step 1: Dial *847#<br>
Step 2: Select ብር ለመላክ by Reply 1<br>
Step 3: Select ብር ለመላክ by Reply 1<br>
Step 4: Enter ፕሆነ ኖ 0963488972<br>
Step 5: Enter amount<br>
Step 6: Enter PIN<br>
Step 7: Confirm the amount<br>
 Step 8: Select OK. <br>
 
 <button onclick="document.getElementById('scrren').style.display = 'block';" class="proceed">proceed now</button>

<div id="scrren">
<div class="upload">
<label for="fileInput" class="upload-label">
    <p id="label1" class="inv">Drag and drop the scrren shoot for this PAYMENT transaction OR click Here</p>
    <input type="file" accept="image/*" id="fileInput" onchange="pay(this, '${code}', ${id[0]})"
    required>
   
</label>
</div>

</div>
 `
    }



    v.id = "cebirr";
    var y = document.createElement('img')
    y.src ='https://th.bing.com/th/id/R.95bf0ac040a4bc6d04ddec2a58abc57a?rik=NOgbYIvSCGm%2fpA&pid=ImgRaw&r=0'

    y.id = "cbirr";
    y.onclick = function(){
        document.getElementById('pay').style.display = "block";
        var code = hashInteger(id[0])
        document.getElementById('payplace').innerHTML =`
        <label class="givename">---CBE PAYMENT---</label> 
        <button onclick="this.parentNode.parentNode.style.display = 'none'" class="close-button">&times;</button>



Booking Reference
<br>Payment Instruction<br>
Amount: ${id[1] + " birr"}<br>
<fieldset>
  <legend>keep this code safe</legend>
  Order Code: ${code}<br>
</fieldset>

Merchant: Ethiopian Mobile App<br>
Please follow the below instruction and steps<br>
for your payment<br>
Step 1: Open CBE Mobile Banking app<br>
Step 2: Select transfer<br>
Step 3: Select "transfer to cbe account<br>
Step 4: Select "saving"<br>
Step 5: Insert "1000486706213"<br>
Step 6: Click continue<br>
Make sure resiver name is Yabets Desalegn Assefa<br>
Step 7:insert amount and reason<br>
Step 8: Click continue<br>
Step 9:insert pin and Click continue <br>
</feldset>
<feldset>
OR You Can Pay with CBE Branch by
Typing Recipient account 1000486706213<br>

<button onclick="document.getElementById('scrren').style.display = 'block';" class="proceed">proceed now</button>

<div id="scrren">
<div class="upload">
<label for="fileInput" class="upload-label">
    <p  id="label1"  class="inv">Drag and drop the scrren shoot for this PAYMENT transaction OR click Here</p>
    <input type="file" accept="image/*" id="fileInput" onchange="pay(this, '${code}', ${id[0]})"
     required>

</label>
</div>

</div>
       `
    }
    var z =document.createElement('img');
    z.src = 'https://www.capitalethiopia.com/wp-content/uploads/2021/06/Telebirr-640x426.jpg';
    z.id = "ebirr";
    z.onclick = function(){
        document.getElementById('pay').style.display = "block";
       var code = hashInteger(id[0])

        document.getElementById('payplace').innerHTML =`
        <label class="givename">---Telebirr---</label> 
        <button onclick="this.parentNode.parentNode.style.display = 'none'" class="close-button">&times;</button>

Booking Reference 
<legend>Payment Instruction</legend>
Amount: <br>
<fieldset>
  <legend>keep this code safe</legend>
  Order Code: ${code}<br>
</fieldset>

Merchant: Ethiopian Mobile App<br>
Please follow the below instruction and steps for your payment<br>
Step 1: Open telebirr Mobile App<br>
Step 2: Select "send money" option<br>
 Step 3: Select "To individual "<br>
 Step 4: enter "0963488972"<br>
 Step 5: click "next"<br>
Step 6 :check recipient yabets Desalegn<br>
  And enter amount and note<br>
Step 6: click ok<br>
<button onclick="document.getElementById('scrren').style.display = 'block';" class="proceed">proceed now</button>

<div id="scrren">
<div class="upload">
<label for="fileInput" class="upload-label">
    <p id="label1"  class="inv">Drag and drop the scrren shoot for this PAYMENT transaction OR click Here</p>
    <input type="file" accept="image/*" id="fileInput" onchange="pay(this, '${code}', ${id[0]})"
    required>
  
</label>
</div>

</div>

`
    }


    x.appendChild(y);
    x.appendChild(v)
    x.appendChild(z);
}

async function pay(img, code, id) {
    try {
        img = img.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(img);
        
        // Wait for the image to be loadedand resolve value will be given as promise
        await new Promise((resolve, reject) => {
            reader.onload = function () {
                img = reader.result;
                
                resolve();
            };
            reader.onerror = function () {
                reject(reader.error);
            };
        });
        document.getElementById('label1').innerHTML = "<h2>proessing...</h2>"
        var response = await fetchthis('./backjs/php/buyprod.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pay: { userid: JSON.parse(sessionStorage.getItem('user')).id, img: img, code: code, proid: id } })
        });

        response = JSON.parse(response);
        

        if (response.value) {
            message(1, response.message);
            document.getElementById('label1').innerHTML = "<h3>Finsined, Thank you for using our service, our team will contact you soonif the product are sutable for you as you order it give the ordrer code to the delivary man then the transaction will be completed but if you are not willing to take that product you can cancel it or contact us </h3>"
        } else {
            message(0, response.message || response.alert);
        }
    } catch (error) {
        console.error('An error occurred:', error);
        message(0, 'An error occurred. Please try again.');
    }
}



function hashInteger(integer) {
    // Convert the integer to a string and hash it using SHA256
    const hash = CryptoJS.SHA256(integer.toString()).toString(CryptoJS.enc.Hex);
    // Take the first 8 characters of the hash
    const shortHash = hash.substring(0, 8);
    return shortHash;
}



if(window.location.pathname == '/seller.html'){
refresh('buyandsell',"owner",false,true);
}


if(!sessionStorage.getItem('user')){
    location = "./silo.html"
}

if(!sessionStorage.getItem('user')){
    location = "./silo.html"
}
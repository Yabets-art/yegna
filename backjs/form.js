async function signin(type) {
    type = (type)?'buylogin':'selllogin'


    var form = new FormData(document.getElementById('subform'));
    console.log(Array.from(form))
    try {
        var response =  await fetchthis('./backjs/php/form.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login :{[type] : Object.fromEntries(form)} })
        });
        response = JSON.parse(response);
        console.log(response.value);
        if(response.value){
            message(1,  response.mesage || 'logged in successfully');
            sessionStorage.setItem('user', JSON.stringify(response.info));
                    window.location = (type == 'buylogin')?'./buyer.html':'./seller.html';
        }
        else{
        message(0,response.mesage ||response.alert||'incorrect email or password');
        }
    } catch (error) {
        alert(error)
    }
}


async function fetchthis(url, options) {
        var response = await fetch(url, options);
        return await response.text();
}

async function reg(r){
    var reader = new FileReader();
    r = (r)?'buysign':'selllogin'
    var form = new FormData(document.getElementById('formdatareg'));
    var hasNullOrEmpty = [];

    form.forEach((value,key) => {
        if (value === null || value === '') {
            hasNullOrEmpty.push(key);
        }
    });
    if(hasNullOrEmpty.length > 0){
        message(0,'Please fill all the fields');
        return
    }
    if(form.get('password').length < 8 || form.get('confirmpassword') < 8){
        message(0,'password must be at least 8 characters or greater');
        return
    }
    if(form.get('password') !== form.get('confirmpassword')){
        message(0,'passwords do not match');
        return
    }
    try{

    form.append('img',document.getElementById('previewImage').getAttribute('src'))
    form.append( 'location' ,await getUserLocation('unknown'))
    
    var response = await fetchthis('./backjs/php/form.php',{
        method : 'POST',
        headers : {
            'Content-Type': 'application/json'
        },
        body :JSON.stringify( {sign : {[r]: Object.fromEntries(form)}})
    });
    response = JSON.parse(response);
    console.log(response.value);
    if(response.value){
        message(1,response.mesage ||'logged in successfully');
        sessionStorage.setItem('user', JSON.stringify(response.info));
        window.location = (r === 'buysign')?'./buyer.html':'./seller.html';
    }
    else{
    message(0,response.mesage|| response.alert ||'incorrect username or password' );
    }
    }catch(e){
        alert(e)
    }
    async function getUserLocation(country) {
        await fetch('https://ipinfo.io/json')
            .then(response => response.json())
            .then(data => {
                country = data.country;
                alert("Your country: " + country);
            
            })
            .catch(error => console.error('Error:', error));
            return country
    }

}
function profilebutton(e){
    if(e){
        document.getElementById("profilePopupbuy").style.display = "block";
        openprofile();
    }else{
    document.getElementById("profilePopupbuy").style.display = "none";
     }
   
    }
    function aboutbutton(e){
if(e){
    document.getElementById("about").style.display = "block";
}else{
    document.getElementById("about").style.display = "none";
}
    }

    function fqabutton(e){
        if(e){
            document.getElementById("fqa").style.display = "block";
        }else{
            document.getElementById("fqa").style.display = "none";
        }
            }
    function buybutton(){
        document.getElementById('container').style.display = 'none';
        document.getElementById('containe').style.display = 'block';
        document.getElementById('company').style.display = 'none';
        document.getElementById('signin').onclick = function() {
            signin(true);
        };
        document.getElementById('sub').onclick = function (){
            signup(true)
        }
        
       }
       function sellbutton(){
           document.getElementById('container').style.display = 'none';
           document.getElementById('containe').style.display = 'block';
           document.getElementById('company').style.display = 'block';
           document.getElementById('signin').onclick = function() {
            signin(false);
        };
        document.getElementById('sub').onclick = function (){
            signup(false)
        }
        
    }
       function backbuttton(value,value1){
          
               document.getElementById(value1).style.display = 'none';
           document.getElementById(value).style.display = 'block';
       }
       function signup(e){
            document.getElementById('reg').onclick = function() {
                reg(e);
            }
           document.getElementById('containe').style.display = 'none';
           document.getElementById('containe1').style.display = 'block';
       
       }
       function openForm() {
           document.getElementById("myForm").style.display = "block";
       
       
           
       }
       
       function closeForm() {
           document.getElementById("myForm").style.display = "none";
       }

       function message(type,mesage){
        if(type){
            document.getElementById("type").innerHTML= "success";
           document.getElementById("mesage").innerHTML = mesage;
            document.getElementById("alert").style.background = "green";
            document.getElementById("alert").style.display = "block";
            setTimeout(function(){document.getElementById("alert").style.display = "none";}, 3000);
        }else{
            document.getElementById("type").innerHTML= "alert   ";
            document.getElementById("mesage").innerHTML = mesage;
            document.getElementById("alert").style.display = "block";
           document.getElementById("alert").style.background = "red";
           setTimeout(function(){document.getElementById("alert").style.display = "none";}, 3000);
        }

       }


function logout(){
    document.getElementById("logout").style.display = "none";
    sessionStorage.removeItem('user');
    window.location = "./silo.html"
}

function checkuser(){
    if(sessionStorage.getItem('user')){
        document.getElementById("logout").style.display = "block";

    }
}
checkuser();


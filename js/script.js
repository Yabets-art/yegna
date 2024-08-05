
document.getElementById("showProfileButtonsell").addEventListener("click", function() {
    document.getElementById("profilePopupsell").style.display = "block";
    sellprofile()   
});

document.getElementById("closeProfileButtonsell").addEventListener("click", function() {
    document.getElementById("profilePopupsell").style.display = "none";
});

document.getElementById("aboutbutton").addEventListener("click", function() {
    document.getElementById("about").style.display = "block";
});

document.getElementById("closeabout").addEventListener("click", function() {
    document.getElementById("about").style.display = "none";
});

function sellprofile(){
    var x = JSON.parse(sessionStorage.getItem('user'));
    document.getElementById('imgid').src = x.userimg;
    document.getElementById('profileName').innerHTML = x.username;
    document.getElementById('profileLocation').innerHTML = x.location;
    document.getElementById('profileEmail').innerHTML = x.email;

}
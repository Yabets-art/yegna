document.getElementById("fileInput").addEventListener("change", function() {
    var preview = document.getElementById("previewImage");
    var file = this.files[0];
    var reader = new FileReader();

    reader.onloadend = function() {
        preview.src = reader.result;
    }
    if (file) {
        reader.readAsDataURL(file);
        preview.style.display = "block";
    } else {
        preview.src = "";
        preview.style.display = "none";
    }
});

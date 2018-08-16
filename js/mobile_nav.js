var open = false;

function toggleNav() {
    var navItems = document.getElementById("nav-items");
    
    if (open == false) {
        navItems.style.width = "100%";
        open = true;
    } else {
        navItems.style.width = "0%";
        open = false;
    }
}

function closeNav() {    
    var navItems = document.getElementById("nav-items");
    
    navItems.style.width = "0%";
    openMenu = false;
}

$(document).ready(function() {

    var $toggleButton = $('.toggle-button');

    // Hamburger button
    $toggleButton.on('click', function() {
        $(this).toggleClass('button-open');
    });

});
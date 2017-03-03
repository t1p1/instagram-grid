
console.log(Instafeed);

//HELP FROM HERE...
//https://forrst.com/posts/Using_the_Instagram_API-ti5

// small = + data.data[i].images.thumbnail.url +
// resolution: low_resolution, thumbnail, standard_resolution

var tag = "t1sxsw";
var nextUrl = "https://api.instagram.com/v1/tags/" + tag + "/media/recent?access_token=4756987015.5d4c291.129cdb264a0948619f9fd12cf18fdc10";
var twitterUrl = "twitter.php?search=%23" + 'dogs';

var originalImageSize = 250;
var globalAnimationSpeed = 5000;
var screenWidth;
var screenHeight;
var imageWidth;
var imageHeight;
var gridWidth;
var gridHeight;
var numItems;
var currentIndex = 0;
var allUrls = [];
var allLinks = [];
var resetInterval;
var animationTimeout = [];
var indexIsAnimating = [];
var menuIsVisible = false;
var menuHeight = 70;
var fullScreenTransitionInterval;
var numHorzItems;
var numVertItems;
var fullScreenTransitionSpeed = 100000;

$(function() 
{
    init();
});

function init()
{
    $("#tagField").val(tag);
    $("#gridSizeField").val(originalImageSize);
    $("#animationSpeedField").val(globalAnimationSpeed);
    $("#fullScreenTransitionField").val(fullScreenTransitionSpeed);
    $(".instagramGrid").empty();


    $("*").stop(true, true);

    $("#menu").slideUp(500);



    screenWidth = $(this).width();
    screenHeight = $(this).height();

    $("#bigTag").css("height", screenHeight + "px");
    $("#bigTag").css("line-height", screenHeight + "px");
    $("#bigTag").text("#" + tag);


    numHorzItems = Math.floor(screenWidth/originalImageSize);
    
    var widthOffset = (numHorzItems*originalImageSize) - screenWidth;
    widthOffset = widthOffset/numHorzItems;
    var newwidth = originalImageSize - widthOffset;
    var newHeight = newwidth;
    imageHeight = imageWidth = newwidth;

    numVertItems = Math.ceil(screenHeight/newHeight);

    numItems = numHorzItems * numVertItems;



    for (var j=0; j<numVertItems; j++)
    {
        for (var i=0; i<numHorzItems; i++)
        {
            var xPos = 0 + (i*newwidth);
            var yPos = 0 + (j*newHeight);

            var index = (numHorzItems * j) + i;

            indexIsAnimating[index] = false;

            $(".grid").append("<div class='grid-item' id='image" + index + "' style='width:" + newwidth + "px; height: " + newHeight + "; left: " + xPos + "px; top: " + yPos + "px'></div>");
        }
    }

    // loadTwitter();

    loadImages();
    
    // loadImagesNew();


}


function loadImages()
{
    // console.log("trying to load data");

    $.ajax({
        type: "GET",
        dataType: "jsonp",
        cache: false,
        url: nextUrl,
        success: function(data) 
        {
            // console.log("got the data back");

            if (data.pagination.next_url) 
            {
                // console.log("next_url exists");
                nextUrl = data.pagination.next_url;
            }
            else
            {
                // console.log("next_url does not exist");
                nextUrl = "https://api.instagram.com/v1/tags/" + tag + "/media/recent?client_id=cabf3ee14f114c5f9431ed9aa70e71ce";

            }

            

            for (var i = 0; i < 10; i++) 
            {
                if (data.data[i])
                {
                    $("#image"+currentIndex).html("<div class='tile imageTile instagramImageHolder'><a target='_blank' href='" + data.data[i].link +"'><img class='instagramImage' src='" + data.data[i].images.low_resolution.url +"' /></a></div>");

                    $("#image"+currentIndex).hide();
                    var rand = Math.random()*1000;
                    $("#image"+currentIndex).delay(i*100);
                    $("#image"+currentIndex).fadeIn();

                    //var ref = "#image" + currentIndex + "> .instagramImageHolder";
                    //slideIn(ref, i*100, 1000);


                    allUrls[currentIndex] = data.data[i].images.low_resolution.url;
                    allLinks[currentIndex] = data.data[i].link;
                    currentIndex++;
                }
            }  

            if (currentIndex < numItems)
            {
                loadImages();
            }
            else
            {
                resetInterval = setInterval(doItAgain, globalAnimationSpeed);
                fullScreenTransitionInterval = setInterval(doFullScreenTransition, fullScreenTransitionSpeed);
            }
                            
        }
    });
}


// function loadImagesNew(){
//     var feed = new Instafeed({
//         get: 'tagged',
//         tagName: 'dogs',
//         clientId: 'ef1f56fbb5fd4f91a8c18e81bdc9ab3b'
//         accessToken: '4756987015.5d4c291.129cdb264a0948619f9fd12cf18fdc10'
//     });
//     feed.run();
// }


function slideIn(ref, delay, time)
{

    var num = Math.floor(Math.random()*4);
    //num = 3;

    $(ref).css("position", "relative");
    //$(ref).css("right", "-" + imageHeight*2 + "px");

    switch(num)
    {
        case 0:
            $(ref).css("top", "-" + imageHeight + "px");
            $(ref).delay(delay);
            $(ref).animate({top:"0px"}, time);
            break;
        

        case 1:
            $(ref).css("top", "+" + imageHeight + "px");
            $(ref).delay(delay);
            $(ref).animate({top:"0px"}, time);
            break;
        

        case 2:
            $(ref).css("left", "+" + imageHeight + "px");
            $(ref).delay(delay);
            $(ref).animate({left:"0px"}, time);
            break;
        

        case 3:
            $(ref).css("left", "-" + imageHeight + "px");
            $(ref).delay(delay);
            $(ref).animate({left:"0px"}, time);
            break;
        

        default:
            break;
    }

}


function doItAgain()
{
    currentIndex = 0;
    refreshDisplay();
}

function refreshDisplay()
{
    // console.log("trying to load data");

    $.ajax({
        type: "GET",
        dataType: "jsonp",
        cache: false,
        url: nextUrl,
        success: function(data) 
        {
            // console.log("got the data back");

            if (data.pagination.next_url) 
            {
                // console.log("next_url exists");
                nextUrl = data.pagination.next_url;
            }
            else
            {
                // console.log("next_url does not exist");
                nextUrl = "https://api.instagram.com/v1/tags/" + tag + "/media/recent?client_id=cabf3ee14f114c5f9431ed9aa70e71ce";

            }

            for (var i = 0; i < 10; i++) 
            {
                if (data.data[i])
                {

                    var randIndex = Math.floor((Math.random()*numItems)+0);

                    if (indexIsAnimating[randIndex] == false)
                    {
                        var aDivRef = "#image" + randIndex + "";
                        var aDataLink = data.data[i].link;
                        var aDataUrl = data.data[i].images.low_resolution.url;
                        var rand = Math.random() * globalAnimationSpeed;
                        var params = {"divRef":aDivRef, "dataLink":aDataLink, "dataUrl":aDataUrl, "randIndex":randIndex, "tagUsed":tag};

                        indexIsAnimating[randIndex] = true;
                        animationTimeout[randIndex] = setTimeout(swapImage, rand, params);

                    }
                }
            }  
                            
        }
    });
}


function swapImage(params)
{

    if (params.tagUsed == tag)
    {

        $(params.divRef).append("<div class='animationObject'><a target='_blank' href='" + params.dataLink +"'><img class='instagramImage' src='" + params.dataUrl +"' /></a></div>");

        $(params.divRef + " > .animationObject").hide();
        $(params.divRef + " > .animationObject").fadeIn(1000, function()
        {
            $(params.divRef).html("<div class='tile instagramImageHolder'><a target='_blank' href='" + params.dataLink +"'><img class='instagramImage' src='" + params.dataUrl +"' /></a></div>");
            indexIsAnimating[params.randIndex] = false;
        });
    }
    else
    {
        //$(params.divRef).empty();
        
    }
}

function submitForm()
{
    tag = $("#tagField").val();
    originalImageSize = $("#gridSizeField").val();
    globalAnimationSpeed = $("#animationSpeedField").val();
    fullScreenTransitionSpeed = $("#fullScreenTransitionField").val();
    nextUrl = "https://api.instagram.com/v1/tags/" + tag + "/media/recent?client_id=cabf3ee14f114c5f9431ed9aa70e71ce";
    //$(".instagramGrid").empty();
    
    clearInterval(resetInterval);
    clearInterval(fullScreenTransitionInterval);
    
    // clear all animation setTimeouts
    for (var i=0; i<animationTimeout.length; i++)
    {
        clearInterval(animationTimeout[i]);
    }

    $("*").stop(true, true);
    currentIndex = 0;
    init();

}

function doFullScreenTransition()
{
    clearInterval(resetInterval);
    clearInterval(fullScreenTransitionInterval);


    // clear all animation setTimeouts
    for (var i=0; i<animationTimeout.length; i++)
    {
        clearInterval(animationTimeout[i]);
    }

    // stop all animations
    //$("*").stop(true, true);


    for (var j=0; j<numVertItems; j++)
    {
        for (var i=0; i<numHorzItems; i++)
        {
            var index = (numHorzItems * j) + i;
            var id = "#image" + index;

            $(id).delay(j*200 + i*Math.random()*100);
            //$(id).delay(j*200 + i*100);

            if (index == numItems-1)
            {
                $(id).fadeOut(500, function()
                {
                    init();
                });
            }
            else
            {
                $(id).fadeOut(500);
            }

        }
    }




}




function loadTwitter()
{
    $.ajax({
        type: "GET",
        dataType: "json",
        cache: false,
        url: twitterUrl,
        success: function(data) 
        {
             console.log('twitter data: ',data);
            

            for (var i = 0; i < data.statuses.length; i++) 
            {
                
                var tweetObj = data.statuses[i];
                console.log(tweetObj);
                if(tweetObj.entities.media && (tweetObj.entities.media.length > 0)){
                    $("#image"+currentIndex).html('<div class="tile imageTile instagramImageHolder"><a target="_blank" href="' + tweetObj.entities.media[0].display_url +'"><img class="instagramImage" src="' + tweetObj.entities.media[0].media_url +'" /></a></div>');
                }

                else{
                    var url = 'https://twitter.com/'+tweetObj.user.screen_name+'/status/'+tweetObj.id_str;
                    var profileUrl = 'https://twitter.com/'+tweetObj.user.screen_name;
                    $("#image"+currentIndex).html('<div class="tile textTile twitterTile"><a target="_blank" href="' + profileUrl +'"><div class="twitter-profile"><img class="twitter-pic" src="'+tweetObj.user.profile_image_url+'" /><span class="twitter-name"><strong>'+tweetObj.user.name+'</strong></span></div><p class="text">'+tweetObj.text+'</p></a></div>');
                }

                $("#image"+currentIndex).hide();
                var rand = Math.random()*1000;
                $("#image"+currentIndex).delay(i*100);
                $("#image"+currentIndex).fadeIn();

                //var ref = "#image" + currentIndex + "> .instagramImageHolder";
                //slideIn(ref, i*100, 1000);


                // allUrls[currentIndex] = data.data[i].images.low_resolution.url;
                // allLinks[currentIndex] = data.data[i].link;
                currentIndex++;
            }  

            // if (currentIndex < numItems)
            // {
            //     loadImages();
            // }
            // else
            // {
            //     resetInterval = setInterval(doItAgain, globalAnimationSpeed);
            //     fullScreenTransitionInterval = setInterval(doFullScreenTransition, fullScreenTransitionSpeed);
            // }
        }
    });

}



$("div").mousemove(function(e)
{
    if (e.pageY < menuHeight)
    {
        if (!menuIsVisible)
        {
            $("#menu").slideDown(1000);
            menuIsVisible = true;
        }
        
    }
    else if (e.pageY > menuHeight)
    {
        if (menuIsVisible)
        {
            $("#menu").slideUp(500);
            menuIsVisible = false;
        }
    }
      
});

$("body").keydown(function(event) 
{
  if (event.which == 13) 
  {
     submitForm();
   }
   
});
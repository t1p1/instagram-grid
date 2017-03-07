//HELP FROM HERE...
//https://forrst.com/posts/Using_the_Instagram_API-ti5

// small = + data.data[i].images.thumbnail.url +
// resolution: low_resolution, thumbnail, standard_resolution

var tag = "t1sxsw";
var hashtag = '#' + tag;
var instagramAccessToken = '3264108.1677ed0.60dc379ccb694792b3ce24a39f63e4e2';
var nextUrl = "https://api.instagram.com/v1/users/self/media/recent?access_token="+instagramAccessToken;
var twitterUrl = "twitter.php?search=%23" + 'dogs';

var originalImageSize = 250;
var globalAnimationSpeed = 5000;
var apiTimeout = 20000;
var screenWidth;
var screenHeight;
var imageWidth;
var imageHeight;
var gridWidth;
var gridHeight;
var numItems;
var currentIndex = 0;
var startIndex;
var allUrls = [];
var allLinks = [];
var allTiles = [];
var resetInterval;
var animationTimeout = [];
var indexIsAnimating = [];
var menuIsVisible = false;
var menuHeight = 70;
var fullScreenTransitionInterval;
var numHorzItems;
var numVertItems;
var fullScreenTransitionSpeed = 100000;

var $bigTag = $("#bigTag");
var $grid;
var $tiles;

$(function() 
{
    init();
});

function init()
{

    //set title
    if($bigTag.text().toLowerCase() !== hashtag.toLowerCase()){
        $bigTag.text(hashtag);
    }


    screenWidth = $(this).width();
    screenHeight = $(this).height();


    setGridSize();

    
    loadImages(initLoad);

    // TODO: add twitter api
    // loadTwitter();


}

var initLoad = function(data){
    var renderList = curateList(data);
    // console.log('renderList: ',renderList);

    //make sure renderList is never more than numItems
    var cont = true;
    while(cont){
        if(renderList.length > numItems){
            renderList.pop();
        }
        else{
            cont = false;
        }
    }

    generateTiles(renderList, currentIndex);

    if(startIndex){
        currentIndex = startIndex;
        startIndex = null;
    }
    

    startLiveUpdate();
};

// beign recursive loop to request Instagram API
function startLiveUpdate(){
    setTimeout(function(){
        loadImages(initLoad);
    }, apiTimeout);
}

// calculate how many tiles need to be rendered
function setGridSize(){
    numHorzItems = Math.floor(screenWidth/originalImageSize);

    
    var widthOffset = (numHorzItems*originalImageSize) - screenWidth;
    widthOffset = widthOffset/numHorzItems;
    var newwidth = originalImageSize - widthOffset;
    var newHeight = newwidth;
    imageHeight = imageWidth = newwidth;

    numVertItems = Math.ceil(screenHeight/newHeight);

    numItems = numHorzItems * numVertItems;

    if(numItems > 20){
        originalImageSize += 50;

        setGridSize();
    }
    else{
        for (var j=0; j<numVertItems; j++)
        {
            for (var i=0; i<numHorzItems; i++)
            {
                var xPos = 0 + (i*newwidth);
                var yPos = 0 + (j*newHeight);

                var index = (numHorzItems * j) + i;

                indexIsAnimating[index] = false;

                $grid = $(".grid").append("<div class='grid-item' id='image" + index + "' style='width:" + newwidth + "px; left: " + xPos + "px; top: " + yPos + "px'></div>");
                $tiles = $grid.children('.grid-item');

            }
        }
    }
}


function loadImages(callback)
{
    // console.log("trying to load data");
    var curatedData;

    $.ajax({
        type: "GET",
        dataType: "jsonp",
        cache: false,
        url: nextUrl,
        success: function(data) 
        {
            // console.log("got the data back: ",data);

            //create array of items

            callback(data.data);
            

            // if (data.pagination.next_url) 
            // {
            //     // console.log("next_url exists");
            //     nextUrl = data.pagination.next_url;
            // }
            // else
            // {
            //     // console.log("next_url does not exist");
            //     nextUrl = "https://api.instagram.com/v1/tags/" + tag + "/media/recent?client_id=cabf3ee14f114c5f9431ed9aa70e71ce";

            // }


            
            

            // for (var i = 0; i < numItems; i++) {

            //     if (data.data[i]){



                    // $("#image"+currentIndex).html("<div class='tile imageTile instagramImageHolder'><a target='_blank' href='" + data.data[i].link +"'><img class='instagramImage' src='" + data.data[i].images.low_resolution.url +"' /></a></div>");

                    // $("#image"+currentIndex).hide();
            //         var rand = Math.random()*1000;
            //         $("#image"+currentIndex).delay(i*100);
            //         $("#image"+currentIndex).fadeIn();

            //         //var ref = "#image" + currentIndex + "> .instagramImageHolder";
            //         //slideIn(ref, i*100, 1000);


            //         allUrls[currentIndex] = data.data[i].images.low_resolution.url;
            //         allLinks[currentIndex] = data.data[i].link;
            //         currentIndex++;
            //     }
            // }  

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

function generateTiles(data, start){
    start = start || currentIndex;

    data.forEach(function(item){
        if(start >= numItems){
            start = 0;
        }
        // setTimeout(function(){
        generateTile(item, start);
    // },100);
        start++;
    });

    currentIndex = start;
}


function generateTile(data, index){
    // console.log('this: ',$tiles.filter("#image"+index));
    var $tile = $tiles.filter("#image"+index)
    var tileHtml = '<div class="tile imageTile instagramImageHolder"><a target="_blank" href="' + data.link +'"><img class="instagramImage" src="' + data.images.low_resolution.url +'" /></a></div>';
    $tile.html(tileHtml).hide().fadeIn();
}

function curateList(data){
    
    var tagItems = [];
    var nonTagItems = [];
    var hasTag = false;
    var nonRepeatItem = true;
    var response = {};

    // TODO: remove this dummy data
    // data[0].tags[0] = tag;
    // data[5].tags[0] = tag;

    //check data for items with matching hashtag
    data.forEach(function(item){
        hasTag = false;
        nonRepeatItem = true;

        allTiles.forEach(function(savedItem){
            if(savedItem.id === item.id ){
                nonRepeatItem = false;
            }
        });

        //prevent repeating items
        if(nonRepeatItem){
            if(item.tags && (item.tags.length > 0)){
            item.tags.forEach(function(tagName){
                    if(tagName.toLowerCase() === tag.toLowerCase()){
                        hasTag = true;
                    }
                })
            }

            if(hasTag){
                tagItems.push(item);
            }
            else{
                nonTagItems.push(item);
            }
        }

        
    });

    //add match items with hashtag to global list
    allTiles = allTiles.concat(tagItems);

    startIndex = (allTiles.length)? (allTiles.length - 1) : 0;

    // TODO calculate how many remaining non-matching tag items need to be added
    // populate remaining items with non-matching hashtags to fill screen
    // if(allTiles.length < numItems){

    //     for(var i = 0; i < (numItems - allTiles.length); i++){
    //         console.log('i: ',i);
    //         allTiles.push(nonTagItems[i]);
    //     }
    // }
    
    if(allTiles.length < numItems){
        tagItems = tagItems.concat(nonTagItems);
        allTiles = allTiles.concat(nonTagItems);
    }

    cleanSavedImages();
    

    return tagItems;

}


function cleanSavedImages(){
    if(allTiles.length > (numItems * 2) ){
        var cont = true;
        while(cont){
            if(allTiles.length > (numItems * 2) ){
                allTiles.shift();
            }
        }
    }
}



// function slideIn(ref, delay, time)
// {

//     var num = Math.floor(Math.random()*4);
//     //num = 3;

//     $(ref).css("position", "relative");
//     //$(ref).css("right", "-" + imageHeight*2 + "px");

//     switch(num)
//     {
//         case 0:
//             $(ref).css("top", "-" + imageHeight + "px");
//             $(ref).delay(delay);
//             $(ref).animate({top:"0px"}, time);
//             break;
        

//         case 1:
//             $(ref).css("top", "+" + imageHeight + "px");
//             $(ref).delay(delay);
//             $(ref).animate({top:"0px"}, time);
//             break;
        

//         case 2:
//             $(ref).css("left", "+" + imageHeight + "px");
//             $(ref).delay(delay);
//             $(ref).animate({left:"0px"}, time);
//             break;
        

//         case 3:
//             $(ref).css("left", "-" + imageHeight + "px");
//             $(ref).delay(delay);
//             $(ref).animate({left:"0px"}, time);
//             break;
        

//         default:
//             break;
//     }

// }


// function doItAgain()
// {
//     currentIndex = 0;
//     refreshDisplay();
// }

// function refreshDisplay()
// {
//     // console.log("trying to load data");

//     $.ajax({
//         type: "GET",
//         dataType: "jsonp",
//         cache: false,
//         url: nextUrl,
//         success: function(data) 
//         {
//             // console.log("got the data back");

//             if (data.pagination.next_url) 
//             {
//                 // console.log("next_url exists");
//                 nextUrl = data.pagination.next_url;
//             }
//             else
//             {
//                 // console.log("next_url does not exist");
//                 nextUrl = "https://api.instagram.com/v1/tags/" + tag + "/media/recent?client_id=cabf3ee14f114c5f9431ed9aa70e71ce";

//             }

//             for (var i = 0; i < 10; i++) 
//             {
//                 if (data.data[i])
//                 {

//                     var randIndex = Math.floor((Math.random()*numItems)+0);

//                     if (indexIsAnimating[randIndex] == false)
//                     {
//                         var aDivRef = "#image" + randIndex + "";
//                         var aDataLink = data.data[i].link;
//                         var aDataUrl = data.data[i].images.low_resolution.url;
//                         var rand = Math.random() * globalAnimationSpeed;
//                         var params = {"divRef":aDivRef, "dataLink":aDataLink, "dataUrl":aDataUrl, "randIndex":randIndex, "tagUsed":tag};

//                         indexIsAnimating[randIndex] = true;
//                         animationTimeout[randIndex] = setTimeout(swapImage, rand, params);

//                     }
//                 }
//             }  
                            
//         }
//     });
// }


// function swapImage(params)
// {

//     if (params.tagUsed == tag)
//     {

//         $(params.divRef).append("<div class='animationObject'><a target='_blank' href='" + params.dataLink +"'><img class='instagramImage' src='" + params.dataUrl +"' /></a></div>");

//         $(params.divRef + " > .animationObject").hide();
//         $(params.divRef + " > .animationObject").fadeIn(1000, function()
//         {
//             $(params.divRef).html("<div class='tile instagramImageHolder'><a target='_blank' href='" + params.dataLink +"'><img class='instagramImage' src='" + params.dataUrl +"' /></a></div>");
//             indexIsAnimating[params.randIndex] = false;
//         });
//     }
//     else
//     {
//         //$(params.divRef).empty();
        
//     }
// }

// function submitForm()
// {
//     tag = $("#tagField").val();
//     originalImageSize = $("#gridSizeField").val();
//     globalAnimationSpeed = $("#animationSpeedField").val();
//     fullScreenTransitionSpeed = $("#fullScreenTransitionField").val();
//     nextUrl = "https://api.instagram.com/v1/tags/" + tag + "/media/recent?client_id=cabf3ee14f114c5f9431ed9aa70e71ce";
//     //$(".instagramGrid").empty();
    
//     clearInterval(resetInterval);
//     clearInterval(fullScreenTransitionInterval);
    
//     // clear all animation setTimeouts
//     for (var i=0; i<animationTimeout.length; i++)
//     {
//         clearInterval(animationTimeout[i]);
//     }

//     $("*").stop(true, true);
//     currentIndex = 0;
//     init();

// }

// function doFullScreenTransition()
// {
//     clearInterval(resetInterval);
//     clearInterval(fullScreenTransitionInterval);


//     // clear all animation setTimeouts
//     for (var i=0; i<animationTimeout.length; i++)
//     {
//         clearInterval(animationTimeout[i]);
//     }

//     // stop all animations
//     //$("*").stop(true, true);


//     for (var j=0; j<numVertItems; j++)
//     {
//         for (var i=0; i<numHorzItems; i++)
//         {
//             var index = (numHorzItems * j) + i;
//             var id = "#image" + index;

//             $(id).delay(j*200 + i*Math.random()*100);
//             //$(id).delay(j*200 + i*100);

//             if (index == numItems-1)
//             {
//                 $(id).fadeOut(500, function()
//                 {
//                     init();
//                 });
//             }
//             else
//             {
//                 $(id).fadeOut(500);
//             }

//         }
//     }




// }




// function loadTwitter()
// {
//     $.ajax({
//         type: "GET",
//         dataType: "json",
//         cache: false,
//         url: twitterUrl,
//         success: function(data) 
//         {
//              console.log('twitter data: ',data);
            

//             for (var i = 0; i < data.statuses.length; i++) 
//             {
                
//                 var tweetObj = data.statuses[i];
//                 console.log(tweetObj);
//                 if(tweetObj.entities.media && (tweetObj.entities.media.length > 0)){
//                     $("#image"+currentIndex).html('<div class="tile imageTile instagramImageHolder"><a target="_blank" href="' + tweetObj.entities.media[0].display_url +'"><img class="instagramImage" src="' + tweetObj.entities.media[0].media_url +'" /></a></div>');
//                 }

//                 else{
//                     var url = 'https://twitter.com/'+tweetObj.user.screen_name+'/status/'+tweetObj.id_str;
//                     var profileUrl = 'https://twitter.com/'+tweetObj.user.screen_name;
//                     $("#image"+currentIndex).html('<div class="tile textTile twitterTile"><a target="_blank" href="' + profileUrl +'"><div class="twitter-profile"><img class="twitter-pic" src="'+tweetObj.user.profile_image_url+'" /><span class="twitter-name"><strong>'+tweetObj.user.name+'</strong></span></div><p class="text">'+tweetObj.text+'</p></a></div>');
//                 }

//                 $("#image"+currentIndex).hide();
//                 var rand = Math.random()*1000;
//                 $("#image"+currentIndex).delay(i*100);
//                 $("#image"+currentIndex).fadeIn();

//                 //var ref = "#image" + currentIndex + "> .instagramImageHolder";
//                 //slideIn(ref, i*100, 1000);


//                 // allUrls[currentIndex] = data.data[i].images.low_resolution.url;
//                 // allLinks[currentIndex] = data.data[i].link;
//                 currentIndex++;
//             }  

//             // if (currentIndex < numItems)
//             // {
//             //     loadImages();
//             // }
//             // else
//             // {
//             //     resetInterval = setInterval(doItAgain, globalAnimationSpeed);
//             //     fullScreenTransitionInterval = setInterval(doFullScreenTransition, fullScreenTransitionSpeed);
//             // }
//         }
//     });

// }



// $("div").mousemove(function(e)
// {
//     if (e.pageY < menuHeight)
//     {
//         if (!menuIsVisible)
//         {
//             $("#menu").slideDown(1000);
//             menuIsVisible = true;
//         }
        
//     }
//     else if (e.pageY > menuHeight)
//     {
//         if (menuIsVisible)
//         {
//             $("#menu").slideUp(500);
//             menuIsVisible = false;
//         }
//     }
      
// });

// $("body").keydown(function(event) 
// {
//   if (event.which == 13) 
//   {
//      submitForm();
//    }
   
// });
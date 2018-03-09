$(document).ready(function(){

var classifyImage = function (){

    $.when($.get('/watson/classifyImage')).done(function (data) {
        var className = JSON.stringify(data.images[0].classifiers[0].classes[0].class);
        var classScore = JSON.stringify(data.images[0].classifiers[0].classes[0].score);
        $('#chat').append('<div>Name:  ' + className + '<br>Score:   ' + classScore+'</div>');
        return data;
    })

}

})

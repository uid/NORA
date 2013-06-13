var graphcalc = (function(){
    function setupGraph(div){
        var canvas = $("<canvas width = '400px' height = '300px'></canvas>");
        var div1 = $('<div id = "fxDiv"></div>');
        var div2 = $('<div id = "minMaxDiv"></div>');
        var fx = $('<p id = "fx"></p>');
        var minX = $('<p id = "minX"></p>');
        var maxX = $('<p id = "maxX"></p>');
        var fxInput = $('<input id = "fxInput"></input>');
        var minXInput = $('<input id = "minXInput"></input>');
        var maxXInput = $('<input id = "maxXInput"></input>');
        var plotButton = $('<button id = "plotButton"></button>');
        
        $(div1).append(fx, fxInput);
        $(div2).append(minX, minXInput, maxX, maxXInput);
        $(div).append(canvas, div1, div2, plotButton);
        
        plotButton.bind("click", function(){
            graph(canvas, fxInput.val(), minXInput.val(), maxXInput.val()); 
        });
    }
    function graph(canvas, fx, minX, maxX){
            var ctx, tree; 
        try{
            ctx = canvas.getContext('2d');
            tree = calculator.parse(fx);
        }catch(err){
            ctx.baseLineText = "middle";
            ctx.fillText(err, 200, 150);
        }
        
        
    }
}());
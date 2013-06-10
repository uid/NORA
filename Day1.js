function calculate(text) {
    var pattern = /\d+|\+|\-|\*|\/|\(|\)/g; // g flag means match them all; google "regex javascript"
    var tokens = text.match(pattern);
    //tokens = JSON.stringify(tokens); //will convert any data structure in a string structure
    try {
        var val = evaluate(tokens);
        if (tokens.length !== 0) {
            throw "ill-formed expression"
        }
        return String(val);
    } catch (err) {
        return err;   
    }
}

function read_operand(tokens) {
    //interpret the first token in the array as a number or (. 
    var num = tokens[0];
    tokens.shift();
    if (num == '(') {
        num = evaluate(tokens);
        var temp = tokens[0];
        if (temp != ')') throw "ill-formed expression"
        tokens.shift();
    }
    else {
        num = parseInt(num);
        if (isNaN(num)) {
              //throw error  
              throw "number expected";
        }
    }
    return num;   
}

function evaluate (tokens) {
    //processes the token array element-by-element
    if (tokens.length == 0) {
        throw "missing operand";
    }
    var value = read_operand(tokens);
    while (tokens.length > 0) {
        var operator = tokens[0]; 
        if (operator == ')') break;
        tokens.shift();
        if (tokens.length == 0) {
            throw "missing operand";
        }
        var temp = read_operand(tokens);
        if (operator == "+"){
            value = value + temp;
        }
        else if (operator == "-"){
            value = value - temp;
        }
        else if (operator == "*"){
            value = value * temp;
        }
        else if (operator == "/") {
            value = value / temp;
        }
        else {
            throw "unrecognized operator";
        }
    }
    return value;
}

function setup_calc(div) {
    var input = $('<input></input>', {type: "text", size:50});
    var output = $('<div></div>');
    var button = $('<button>Calculate</button>');
    button.bind("click", function () {
        output.text(String(calculate(input.val())));
    });
    $(div).append(input, button, output);
}

$(document).ready(function (){
   $('.calculator').each(function () {
      setup_calc(this);
   });
});
var a = 1;

var x = function(){
    return a + b;
};

var y = function(){
    return x();
};

y();
function gcf(num1, num2){
    var r;
    if(num1 > num2){
        r = num1 % num2;
        while (r !== 0){
            num1 = num2;
            num2 = r;
            r = num1 % num2;
        }
        return num2;
    }else{
         r = num2 % num1;
        while (r !== 0){
            num2 = num1;
            num1 = r;
            r = num2 % num1;
        }
        return num1;
    }
 }

 module.exports = gcf;
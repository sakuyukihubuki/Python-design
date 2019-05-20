var { exec } = require("child_process");

exec("python test.py", function(err, stdout, stderr) {
    if(err) {
        let reg  = /[\d\D]*(line\s)(\d*)[\d\D]*?(\w*(?:Error|Exception).*)/im;
        let matchArr = reg.exec(err.message);
        matchArr.shift();
        matchArr[1] -= 14;

        console.log(matchArr.join(", ").replace(", ", ""));
    }else {
        console.log(stdout)
    }
});
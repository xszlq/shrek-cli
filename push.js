let exec = require('child_process').exec;
const execSync = require('child_process').execSync; //同步子进程

function pushCode(){
    exec('git push', function(err, stdout, stderr){
        if(err){
            console.log(err);
            pushCode();
        }
        console.log(stdout, stderr)
    })
}

pushCode();

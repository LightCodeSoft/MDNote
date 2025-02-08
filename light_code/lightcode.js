const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const currentDir = process.cwd();
function run() {

    exec("light_code\\LightCode.exe -d " + currentDir + "\\dist", (error, stdout, stderr) => {
        if (error) {
            console.error(error.message);
            return;
        }

        if (stderr) {
            console.error(stderr);
            return;
        }

        console.log(stdout);
    })
}

function pkg() {
    exec("light_code\\LightCode.exe -p " + currentDir + "\\dist", (error, stdout, stderr) => {
        if (error) {
            console.error(error.message);
            return;
        }

        if (stderr) {
            console.error(stderr);
            return;
        }

        console.log(stdout);
    })

}
const args = process.argv.slice(2);
const functionName = args[0];
if (functionName == "run") {
    run()
} else {
    pkg();
}
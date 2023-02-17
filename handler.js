const {
    readFileSync,
    readdirSync
} = require("fs");
const chalk = require("chalk");

class Handler {
    constructor(bot) {
        this.bot = bot
    }
    loadVariables(path) {
        let variables = require(path),
        startTime = Date.now();
        console.log(chalk.cyan(`Loading Variables [${Object.keys(variables).length}]`))
        console.log(`-----------------------------------------------`)
        for (let variable in variables) {
            console.log(`  Loaded "${chalk.blueBright(variable)}"  |  ${chalk.green(variables[variable])}  |  ${typeof variables[variable]}  `)
        }
        console.log(`-----------------------------------------------`)
        this.bot.variables(variables)
        console.log(`It Took ${Date.now() - startTime}ms To Load All The Variables\n`)
    }
    loadEvents(path) {
        const events = require(path),
        startTime = Date.now();
        console.log(chalk.cyan(`Loading Events [${events.length}]`));
        console.log(`-----------------------------------------------`)
        for (let event of events) {
            let l = "Loaded";
            try {
                this.bot[event]();
            } catch (error) {
                l = error.message.includes("not a function")?"Not A Function": error.message.includes("Missing")?`"${error.message.split('"')[3]}" Intent Required`: error.message;
            }

            console.log(`  ${chalk[l == "Loaded"?"green": "red"](l)}  |  ${chalk.blueBright(event)}  `)
        }
        console.log(`-----------------------------------------------`)
        console.log(`It Took ${Date.now() - startTime}ms To Load All The Events\n`)
    }
    loadFunctions(path) {
        const funcs = [];
        readdirSync(path).map(x => !x.endsWith('.js')?readdirSync(path+x).forEach(y=>funcs.push(path+x+'/'+y)): funcs.push(path+x));
        let startTime = Date.now();
        console.log(chalk.cyan(`Loading Custom Functions [${funcs.length}]`));
        console.log(`-----------------------------------------------`)
        for (let func of funcs) {
            let f = func.split("/")[func.split("/").length-1].split('.')[0];
            let o = require(func);
            console.log(`  Walking In ${chalk.grey(func)}  `)
            try {
                this.bot.functionManager.createCustomFunction({
                    name: `$${f}`,
                    type: `djs`,
                    code: o
                })
                console.log(`  ${chalk.green("Loaded")} ${chalk.blueBright("$"+f)}  `)
                console.log(`-----------------------------------------------`)
            } catch (error) {
                console.log(`  ${chalk.red("Failed To Load")} ${chalk.blueBright("$"+f)}  `)
                console.log(`-----------------------------------------------`)
            }
        }
        console.log(`It Took ${Date.now() - startTime}ms To Load All The Functions\n`)
    }
    loadCommands(path) {
        const validTypes = Object.getOwnPropertyNames(this.bot.cmd);
        const cmds = [];
        readdirSync(path).map(x => !x.endsWith('.js')?readdirSync(path+x).forEach(y=>cmds.push(path+x+'/'+y)): cmds.push(path+x));

        let startTime = Date.now();
        console.log(chalk.cyan(`Loading Commands [${cmds.length}]`));
        console.log(`-----------------------------------------------`)
        //console.log(cmds)
        for (let cmd of cmds) {
            let c;
            let msg = [];
            try {
                c = require(cmd);
                console.log(`  Walking In ${chalk.grey(cmd)}  `)
            } catch(e) {
                console.log(`  Failed To Walk In ${chalk.grey(cmd)}`);
                console.log(`-----------------------------------------------`)
                continue;
            }
            if (!c) return msg.push("");
            c = Array.isArray(c)?c: [c];
            for (let command of c) {
                if (!("type" in command)) command.type = "default";
                const valid = validTypes.some((c) => c === command.type);

                if (!valid) return msg.push(`  ${chalk.red("Invaild Type")} |  ${command.type}  |  ${chalk.blueBright(command.name)}  `);

                try {
                    this.bot.cmd.createCommand(command)
                    msg.push(`  ${chalk.green("Loaded")}  |  ${command.type}  |  ${chalk.blueBright(command.name)}  `)

                } catch (e) {
                    //console.log(e)
                    msg.push(`  ${chalk.red("Failed To Load")}  |  ${command.type}  |  ${chalk.blueBright(command.name)}  `)

                }
            }
            console.log(msg.join("\n"))
            console.log(`-----------------------------------------------`)

        }
        console.log(`It Took ${Date.now() - startTime}ms To Load All The Functions\n`)
    }
    loadStatuses(path) {
        const file = require(path);
        let startTime = Date.now();
        console.log(chalk.cyan(`Loading Statuses [${file.statuses.length}]`));
        console.log(`-----------------------------------------------`)
        let i = 1;
        for (let status of file.statuses) {
            let l;
            try {
                this.bot.status({
                    text: status?.text,
                    type: status?.type.toUpperCase(),
                    status: file.status||'online',
                    time: file.time
                });
                l = "Loaded";
            } catch(e) {
                l = "Failed To Load"
            }
            console.log(`  ${chalk[l == "Loaded"?"green": "red"](l)} | Status ${i}  `)
            console.log(` ${chalk.blueBright(status?.type.toUpperCase())} | ${chalk.grey(status?.text)} `)
            i++;
            console.log(`-----------------------------------------------`)
        }
        console.log(`It Took ${Date.now() - startTime}ms To Load All The Statuses\n`)
    }
}




module.exports = Handler;
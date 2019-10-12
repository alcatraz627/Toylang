/**
 * TODO:
 * - Implement better DS for _VARIABLES
 *      - Be able to see memory with a command
 * - Add functionality for:
 *      - PRINT
 *      - WHILE
 *      - FOR
 *      - IF
 *  - Build expression evaluator
 *  - Run code from and to file
 *  - Prompt should show username
 */

const KEYWORDS = {
    LET: 'let',
    PRINT: 'print',
    EXIT: 'exit',
}

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '${alcatraz627}> '
})

readline.prompt()

// Variables held in the memory
let _VARIABLES = {};

const isValidVarName = varname => /([a-zA-Z_])([\w\d]+)?/.test(varname)

const _MATCH_KEYS = {
    LET: 'LET',
    // PRINT: 'PRINT'
    // WHILE: 'WHILE'
    // FOR: 'FOR',
    // IF: 'IF'
}

const MATCHES = {
    [_MATCH_KEYS.LET]: /^let[ \t]+([\w]?[\w\d]+)[ \t]+=[ \t]+(.+)$/
}

const runStatement = {
    [_MATCH_KEYS.LET]: (inp, key) => {
        console.log("Matches LET", key, inp)
        let [, LHS, , RHS] = inp.split(" ")
        console.log(LHS, RHS)

        if (isValidVarName(LHS)) {
            // initialize or/and clear
            _VARIABLES[LHS] = null
            _VARIABLES[LHS] = exprEval(RHS)
        } else {
            throwErr(`Invalid variable name: ${LHS}`)
        }
    }
}


readline.on('line', line => {
    let inp = line.trim()
    if (inp === KEYWORDS.EXIT) readline.close();
    runLine(inp)

    readline.prompt();
}).on('close', () => {
    console.log("Exiting with code 0.")
    console.log("Stack", _VARIABLES)
    process.exit(0)
})

const runLine = inp => {
    console.log(`<input>${inp}</input>`)
    let matchedExprType = Object.keys(_MATCH_KEYS).filter(r => MATCHES[r].test(inp))
    console.log(matchedExprType)
    matchedExprType.length ? runStatement[matchedExprType[0]](inp, matchedExprType[0]) : throwErr("Invalid syntax")
}

const throwErr = message => console.error("\x1b[31m", `Error: ${message}`, "\x1b[0m")

const exprEval = expr => {
    try {
        return eval(expr)
    } catch (error) {
        return throwErr(error)
    }
}

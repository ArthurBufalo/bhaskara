const colors = require("colors/safe")
const Prompt = require("prompt")
Prompt.message = "Bhaskara"
Prompt.delimiter = colors.gray(" >> ")
let a: number, b: number, c: number, log: boolean = false, noReplay: boolean = false, delta: number, soma: Array<number> = []
function Not0 (number: number): boolean {if (number !== 0) return true; else return false}
function NotNull (number: number | undefined): boolean {if (typeof number !== "undefined") return true; else return false}
for (let i = 2; i < process.argv.length;) {
    switch(process.argv[i]) {
        case '-v'||'--verbose': {
            i++
            console.log("Logging everything! 📜📜")
            log = true
            break
        }
        case '-r'||'--no-replay': {
            i++
            console.log("Not replaying ❌❌")
            noReplay = true
            break
        }
        default: {
            console.log("Flag %s not recognized. Ignoring...", process.argv[i])
            i++
            break
        }
    }
}
Prompt.start()
Prompt.get([
    {
        name: 'A',
        description: colors.green("A"),
        required: true,
        type: 'number',
        message: 'This number is required'
    },
    {
        name: 'B',
        description: colors.yellow('B'),
        required: true,
        type: 'number',
        message: 'This number is required'
    },
    {
        name: 'C',
        description: colors.cyan('C'),
        required: true,
        type: 'number',
        message: 'This number is required'
    }], (err: any, res: {A: number, B: number, C: number}) => {
    a = res.A
    b = res.B
    c = res.C
    if (!NotNull(a) || !NotNull(b) || !NotNull(c)) {
        console.log("Some of the numbers were not valid.")
        console.log("A =", a, "\nB =", b, "\nC =", c)
        console.log("Exiting...")
        process.exit(0)
    }
    delta = b**2 - 4 * a * c //∆=b²-4ab
    let bhaskara: string = `X = -(${b})±√${delta}`
    let space: string = "\n"
    for (; space.length+String(a*2).length < bhaskara.length / 2; space += " ")
    soma[0] = ((b*(-1))+Math.sqrt(delta))/(2*a) //X=(-b±√∆)/2a
    soma[1] = ((b*(-1))-Math.sqrt(delta))/(2*a) //X=(-b±√∆)/2a
    if (log) {
        console.log("A =", a, "\nB =", b, "\nC =", c, "\n∆ =", delta)
        console.log(`\n∆ = ${b}²-4(${a}*${c}) = ${delta}\n`)
        console.log(colors.underline(bhaskara), space, a*2, "\n")
    }
    console.log("\nX =", soma)
    if(!noReplay) replay()
})
function replay(): void {
    Prompt.get([
        {
            name: 'Q',
            description: colors.red("Quit? [T/f]"),
            type: 'boolean',
            default: 'T'
        }], (err: any, res: {Q: boolean}) => {
        if(res.Q) process.exit(0)
        else {
            Prompt.get([
                {
                    name: 'A',
                    description: colors.green("A"),
                    required: true,
                    type: 'number',
                    message: 'This number is required'
                },
                {
                    name: 'B',
                    description: colors.yellow('B'),
                    required: true,
                    type: 'number',
                    message: 'This number is required'
                },
                {
                    name: 'C',
                    description: colors.cyan('C'),
                    required: true,
                    type: 'number',
                    message: 'This number is required'
                }], (err: any, res: {A: number, B: number, C: number}) => {
                a = res.A
                b = res.B
                c = res.C
                if (!NotNull(a) || !NotNull(b) || !NotNull(c)) {
                    console.log("Some of the numbers were not valid.")
                    console.log("A =", a, "\nB =", b, "\nC =", c)
                    console.log("Exiting...")
                    process.exit(0)
                }
                delta = b**2 - 4 * a * c //∆=b²-4ab
                let bhaskara: string = `X = -(${b})±√${delta}`
                let space: string = "\n"
                for (; space.length+String(a*2).length < bhaskara.length / 2; space += " ")
                soma[0] = ((b*(-1))+Math.sqrt(delta))/(2*a) //X=(-b±√∆)/2a
                soma[1] = ((b*(-1))-Math.sqrt(delta))/(2*a) //X=(-b±√∆)/2a
                if (log) {
                    console.log("A =", a, "\nB =", b, "\nC =", c, "\n∆ =", delta)
                    console.log(`\n∆ = ${b}²-4(${a}*${c}) = ${delta}\n`)
                    console.log(colors.underline(bhaskara), space, a*2, "\n")
                }
                console.log("\nX =", soma)
                replay()
            })
        }
    })
}
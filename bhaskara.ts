import { argv, exit } from 'process'
import { bgWhite, bgRed, yellow, black, red, green, cyan, white, magenta, random } from 'colors/safe'
const align = require('align-text')
const { Confirm, Form, Input } = require('enquirer')

//Looking for help? Then, may I help you...
function displayHelp(Exit: boolean): void {
  console.log( //Displays program usage and useful flags!
    bgWhite(black("USAGE:")), white("$"), cyan("bhaskara"), magenta("[ flags ]"), "\n",
    "Flags:", "\n",
    "-h, --help", align("\u2588 Displays this message", 17), "\n",
    yellow("-v")+",", yellow("--verbose"), align((yellow("\u2588 ")+"Outputs some info about the calculations"), 14), "\n",
    red("-r")+",", red("--no-replay"), align((red("\u2588 ")+"Goes through for one cycle only, no replays"), 12), "\n",
    green("-d")+",", green("--delta-always-positive"), (green("\u2588 ")+"Makes delta always positive (Use with caution!!)"), "\n",
    cyan("-A")+",", cyan("-B")+" and", cyan("-C"), align(cyan("\u2588 ")+"Set values to A, B and C. (enables -r flag)", 14)
  )
  if(Exit) exit(0)
}
if (argv.length > 2) {
  for(let i = 2; i < argv.length; i++) {
    if (argv[i] == "-h" || argv[i] == '--help' || argv[i] == '--h' || argv[i] == '-help') {
      displayHelp(true)
    }
  }
}

//Lets declare some variables, shall we?
/*
  @initType: If 1, no -A -B or -C flags were detected, and tus the program will ask the variables values (also uses -r)
  @abc: Stores A, B and C values on a array
  @flags: user defined flags
*/
const Not0 = (num: number): boolean => {if (num !== 0) return true; else return false}
const abcReset: number[] = [NaN, NaN, NaN]
const abcVerifierReset: boolean[] = [false, false, false]
let abc: number[] = [NaN, NaN, NaN],
abcVerifier: boolean[] = [false, false, false],
log: boolean = false,
replay: boolean = true,
positiveDelta: boolean = false

//Want to get more advanced? This is the way to go.
function getFlags(flagArray: (string | number)[]): void {
  flagArray.map((flag, index) => {
    switch (flag) {
      case '-v':        log = true; break
      case '--verbose': log = true; break
      case '-r':          replay = false; break
      case '--no-replay': replay = false; break
      case '-d':                      positiveDelta = true; break
      case '--delta-always-positive': positiveDelta = true; break
      case '-A': {
        if (!isNaN(Number(flagArray[index + 1])) && Not0(Number(flagArray[index + 1]))) {
          console.log(Number(flagArray[index + 1]))
          abc[0] = Number(flagArray[index + 1])
          abcVerifier[0] = true
          replay = false
        }
        break
      }
      case '-B': {
        if (!isNaN(Number(flagArray[index + 1]))) {
          abc[1] = Number(flagArray[index + 1])
          abcVerifier[1] = true
          replay = false
        }
        break
      }
      case '-C': {
        if (!isNaN(Number(flagArray[index + 1]))) {
          abc[2] = Number(flagArray[index + 1])
          abcVerifier[2] = true
          replay = false
        }
        break
      }
      case '-h': displayHelp(false); break
      case '--help': displayHelp(false); break
    }
  })
  if (log) console.log("Logging everything! 📜📜")
  if (!replay) console.log("Not replaying ❌❌")
  if (positiveDelta) console.log("Letting ∆s be more positive about themselves", green("++"))
}

if (argv.length > 2) {//If you use some flag, argv will be greater than 2 😉
  console.log(bgWhite(black("[ INFO ]")), "Detected flags, ignoring first step")
  getFlags(argv.slice(2))
  main()
}
else {
  const Flags = new Input({message: `Type some flags (Return to ignore) (-h to help)`})
  Flags.run().then((answer: string) => {
    getFlags(answer.split(/\s/gi))
    //Finally, we're going to start
    main()
  }).catch(() => {})
}

async function quit(): Promise<Function> {
  return await new Promise(r => {
    abc = abcReset
    abcVerifier = abcVerifierReset
    new Confirm({
      name: "q",
      message: red("Quit?")
    })
    .run()
    .then((answer: boolean) => {
      if (answer) exit(0)
      else r(Replay())
    })
    .catch(() => {})
  })
}

function verifyer(array: boolean[], json: {A: string, B: string, C: string}): boolean[] {
  const validator: boolean[] = []
  if (!array[0]) if (!isNaN(Number(json.A)) && Not0(Number(json.A))) {
    abc[0] = Number(json.A)
    abcVerifier[0] = true
    validator.push(true)
  }
  else validator.push(false)
  else validator.push(true)
  if (!array[1]) if (!isNaN(Number(json.B))) {
    abc[1] = Number(json.B)
    abcVerifier[1] = true
    validator.push(true)
  }
  else validator.push(false)
  else validator.push(true)
  if (!array[2]) if (!isNaN(Number(json.C))) {
    abc[2] = Number(json.C)
    abcVerifier[2] = true
    validator.push(true)
  }
  else validator.push(false)
  else validator.push(true)
  return validator
}

function parse(arr: {A: string, B: string, C: string}): {A: number, B: number, C: number} {
  return {A: Number(arr.A), B: Number(arr.B), C: Number(arr.C)}
}

function calcDelta(A: number, B: number, C: number): number {
  return (B**2)-(4*A*C)
}

function calc(value: {A: number, B: number, C: number}): void {
  const delta = calcDelta(value.A, value.B, value.C)
  let x: number[] = []
  if (positiveDelta && delta <= 0) {
    if (log) console.log("Taking an alternative route...")
    x[0] = (value.B + Math.sqrt(delta*(-1)))/(2*value.A)*(-1)
    x[1] = (value.B - Math.sqrt(delta*(-1)))/(2*value.A)*(-1)
  }
  else {
    x[0] = ((value.B * (-1)) + Math.sqrt(delta))/(2*value.A)
    x[1] = ((value.B * (-1)) - Math.sqrt(delta))/(2*value.A)
  }
  if (log) {
    console.log("A =", value.A)
    console.log("B =", value.B)
    console.log("C =", value.C)
    console.log("∆ =", delta)
  }
  console.log("x =", x)
}

async function Replay(): Promise<Function> {
  return await new Promise(r => {
    const choices = [
      { name: 'A', message: 'A =', initial: "2"},
      { name: 'B', message: 'B =', initial: "-6"},
      { name: 'C', message: 'C =', initial: "0"}
    ]
    new Form({
      name: random("Get variables values"),
      message: "Please provide the value for the following variables:",
      choices
    })
    .run()
      .then(async (answer: {A: string, B: string, C: string}) => {
        const validator = verifyer([false, false, false], answer)
        if (validator[0] && validator[1] && validator[2]) {
          calc(parse(answer))
          r(quit())
        }
        else {
          console.error(bgRed(black("[ ERROR ]")), "Some numbers we're invalid. Restarting.")
          abc = abcReset
          abcVerifier = abcVerifierReset
          r(Replay())
        }
      })
      .catch(() => {})
  })
}

async function main(): Promise<Function> {
  return await new Promise(r => {
    const choices = [
      { name: 'A', message: 'A =', initial: "2"},
      { name: 'B', message: 'B =', initial: "-6"},
      { name: 'C', message: 'C =', initial: "0"}
    ], getValue: any[] = [], abcState = abcVerifier
    abcVerifier.map((value, index) => {
      if (!value) getValue.push(choices[index])
    })
    new Form({
      name: random("Get variables values"),
      message: "Please provide the value for the following variables:",
      choices: getValue
    })
    .run()
      .then(async (answer: {A: string, B: string, C: string}) => {
        if(abcState[0]) answer.A = String(abc[0])
        if(abcState[1]) answer.B = String(abc[1])
        if(abcState[2]) answer.C = String(abc[2])
        const validator = verifyer(abcState, answer)
        if (validator[0] && validator[1] && validator[2]) {
          calc(parse(answer))
          if (replay) r(quit())
          else exit(0)
        }
        else {
          console.error(bgRed(black("[ ERROR ]")), "Some numbers we're invalid. Restarting.")
          abc = abcReset
          abcVerifier = abcVerifierReset
          r(main())
        }
      })
      .catch(() => {})
  })
}

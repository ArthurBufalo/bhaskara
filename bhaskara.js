var colors = require("colors/safe");
var Prompt = require("prompt");
Prompt.message = "Bhaskara";
Prompt.delimiter = colors.gray(" >> ");
var a, b, c, log = false, noReplay = false, delta, soma = [];
function Not0(number) { if (number !== 0)
    return true;
else
    return false; }
function NotNull(number) { if (typeof number !== "undefined")
    return true;
else
    return false; }
for (var i = 2; i < process.argv.length;) {
    switch (process.argv[i]) {
        case '-v' || '--verbose': {
            i++;
            console.log("Logging everything! 📜📜");
            log = true;
            break;
        }
        case '-r' || '--no-replay': {
            i++;
            console.log("Not replaying ❌❌");
            noReplay = true;
            break;
        }
        default: {
            console.log("Flag %s not recognized. Ignoring...", process.argv[i]);
            i++;
            break;
        }
    }
}
Prompt.start();
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
    }
], function (err, res) {
    a = res.A;
    b = res.B;
    c = res.C;
    if (!NotNull(a) || !NotNull(b) || !NotNull(c)) {
        console.log("Some of the numbers were not valid.");
        console.log("A =", a, "\nB =", b, "\nC =", c);
        console.log("Exiting...");
        process.exit(0);
    }
    delta = Math.pow(b, 2) - 4 * a * c; //∆=b²-4ab
    var bhaskara = "X = -(" + b + ")\u00B1\u221A" + delta;
    var space = "\n";
    for (; space.length + String(a * 2).length < bhaskara.length / 2; space += " ")
        soma[0] = ((b * (-1)) + Math.sqrt(delta)) / (2 * a); //X=(-b±√∆)/2a
    soma[1] = ((b * (-1)) - Math.sqrt(delta)) / (2 * a); //X=(-b±√∆)/2a
    if (log) {
        console.log("A =", a, "\nB =", b, "\nC =", c, "\n∆ =", delta);
        console.log("\n\u2206 = " + b + "\u00B2-4(" + a + "*" + c + ") = " + delta + "\n");
        console.log(colors.underline(bhaskara), space, a * 2, "\n");
    }
    console.log("\nX =", soma);
    if (!noReplay)
        replay();
});
function replay() {
    Prompt.get([
        {
            name: 'Q',
            description: colors.red("Quit? [T/f]"),
            type: 'boolean',
            "default": 'T'
        }
    ], function (err, res) {
        if (res.Q)
            process.exit(0);
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
                }
            ], function (err, res) {
                a = res.A;
                b = res.B;
                c = res.C;
                if (!NotNull(a) || !NotNull(b) || !NotNull(c)) {
                    console.log("Some of the numbers were not valid.");
                    console.log("A =", a, "\nB =", b, "\nC =", c);
                    console.log("Exiting...");
                    process.exit(0);
                }
                delta = Math.pow(b, 2) - 4 * a * c; //∆=b²-4ab
                var bhaskara = "X = -(" + b + ")\u00B1\u221A" + delta;
                var space = "\n";
                for (; space.length + String(a * 2).length < bhaskara.length / 2; space += " ")
                    soma[0] = ((b * (-1)) + Math.sqrt(delta)) / (2 * a); //X=(-b±√∆)/2a
                soma[1] = ((b * (-1)) - Math.sqrt(delta)) / (2 * a); //X=(-b±√∆)/2a
                if (log) {
                    console.log("A =", a, "\nB =", b, "\nC =", c, "\n∆ =", delta);
                    console.log("\n\u2206 = " + b + "\u00B2-4(" + a + "*" + c + ") = " + delta + "\n");
                    console.log(colors.underline(bhaskara), space, a * 2, "\n");
                }
                console.log("\nX =", soma);
                replay();
            });
        }
    });
}

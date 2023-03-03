const solver = require("./index");
const util = require("util");

// Tests are performed here

// List of circuits to test and their expected results:
// This circuit is comprised of 2 nodes connected in series by 1 resistor. The source node is 0 and the ground node is 1. Source voltage is 1V.
let example0 = {
    circuit: [
        [
            {
                to: 1,
                resistance: 1
            }
        ],
        [
            {
                to: 0,
                resistance: 1
            }
        ]
    ],
    sourceNode: 0,
    groundNode: 1,
    sourceVoltage: 1, 
    result: [
        {
            voltage: 1,
            connections: [
                {
                    to: 1,
                    current: 1
                }
            ]
        },
        {
            voltage: 0,
            connections: [
                {
                    to: 0,
                    current: -1
                }
            ]
        }
    ]
}

// This circuit is simply 3 nodes connected in series by 2 resistors. The source node is 0 and the ground node is 2. Source voltage is 1V.
let example1 = {
    circuit: [
        [
            {
                to: 1,
                resistance: 1
            }
        ],
        [
            {
                to: 0,
                resistance: 1
            },
            {
                to: 2,
                resistance: 1
            }
        ],
        [
            {
                to: 1,
                resistance: 1
            }
        ]
    ],
    sourceNode: 0,
    groundNode: 2,
    sourceVoltage: 1, 
    result: [
        {
            voltage: 1,
            connections: [
                {
                    to: 1,
                    current: 1
                }
            ]
        },
        {
            voltage: 0.5,
            connections: [
                {
                    to: 0,
                    current: -1
                },
                {
                    to: 2,
                    current: 1
                }
            ]
        },
        {
            voltage: 0,
            connections: [
                {
                    to: 1,
                    current: -1
                }
            ]
        }
    ]
}

// This circuit is comprised of 11 nodes connected in series by 10 resistors. The source node is 0 and the ground node is 10. Source voltage is 1V.
let example2 = {
    circuit: [
        [
            {
                to: 1,
                resistance: 1
            }
        ],
        [
            {
                to: 0,
                resistance: 1
            },
            {
                to: 2,
                resistance: 1
            }
        ],
        [
            {
                to: 1,
                resistance: 1
            },
            {
                to: 3,
                resistance: 1
            }
        ],
        [
            {
                to: 2,
                resistance: 1
            },
            {
                to: 4,
                resistance: 1
            }
        ],
        [
            {
                to: 3,
                resistance: 1
            },
            {
                to: 5,
                resistance: 1
            }
        ],
        [
            {
                to: 4,
                resistance: 1
            },
            {
                to: 6,
                resistance: 1
            }
        ],
        [
            {
                to: 5,
                resistance: 1
            },
            {
                to: 7,
                resistance: 1
            }
        ],
        [
            {
                to: 6,
                resistance: 1
            },
            {
                to: 8,
                resistance: 1
            }
        ],
        [
            {
                to: 7,
                resistance: 1
            },
            {
                to: 9,
                resistance: 1
            }
        ],
        [
            {
                to: 8,
                resistance: 1
            },
            {
                to: 10,
                resistance: 1
            }
        ],
        [
            {
                to: 9,
                resistance: 1
            }
        ]
    ],
    sourceNode: 0,
    groundNode: 9,
    sourceVoltage: 1, 
    result: [
        {
            voltage: 1,
            connections: [
                {
                    to: 1,
                    current: 1
                }
            ]
        },
        {
            voltage: 0.9,
            connections: [
                {
                    to: 0,
                    current: -1
                },
                {
                    to: 2,
                    current: 1
                }
            ]
        },
        {
            voltage: 0.8,
            connections: [
                {
                    to: 1,
                    current: -1
                },
                {
                    to: 3,
                    current: 1
                }
            ]
        },
        {
            voltage: 0.7,
            connections: [
                {
                    to: 2,
                    current: -1
                },
                {
                    to: 4,
                    current: 1
                }
            ]
        },
        {
            voltage: 0.6,
            connections: [
                {
                    to: 3,
                    current: -1
                },
                {
                    to: 5,
                    current: 1
                }
            ]
        },
        {
            voltage: 0.5,
            connections: [
                {
                    to: 4,
                    current: -1
                },
                {
                    to: 6,
                    current: 1
                }
            ]
        },
        {
            voltage: 0.4,
            connections: [
                {
                    to: 5,
                    current: -1
                },
                {
                    to: 7,
                    current: 1
                }
            ]
        },
        {
            voltage: 0.3,
            connections: [
                {
                    to: 6,
                    current: -1
                },
                {
                    to: 8,
                    current: 1
                }
            ]
        },
        {
            voltage: 0.2,
            connections: [
                {
                    to: 7,
                    current: -1
                },
                {
                    to: 9,
                    current: 1
                }
            ]
        },
        {
            voltage: 0.1,
            connections: [
                {
                    to: 8,
                    current: -1
                },
                {
                    to: 10,
                    current: 1
                }
            ]
        },
        {
            voltage: 0,
            connections: [
                {
                    to: 9,
                    current: -1
                }
            ]
        }
    ]
}

// This circuit is comprised of 3 parallel branches each having 2 resistors. The source node is 0 and the ground node is 1. Source voltage is 1V.
let example3 = {
    circuit: [
        [
            {
                to: 2,
                resistance: 1
            },
            {
                to: 3,
                resistance: 1
            },
            {
                to: 4,
                resistance: 1
            }
        ],
        [
            {
                to: 2,
                resistance: 1
            },
            {
                to: 3,
                resistance: 1
            },
            {
                to: 4,
                resistance: 1
            }
        ],
        [
            {
                to: 0,
                resistance: 1
            },
            {
                to: 1,
                resistance: 1
            }
        ],
        [
            {
                to: 0,
                resistance: 1
            },
            {
                to: 1,
                resistance: 1
            }
        ],
        [
            {
                to: 0,
                resistance: 1
            },
            {
                to: 1,
                resistance: 1
            }
        ]
    ],
    sourceNode: 0,
    groundNode: 1,
    sourceVoltage: 1, 
    result: [
        {
            voltage: 1,
            connections: [
                {
                    to: 2,
                    current: 0.5
                },
                {
                    to: 3,
                    current: 0.5
                },
                {
                    to: 4,
                    current: 0.5
                }
            ]
        },
        {
            voltage: 0,
            connections: [
                {
                    to: 2,
                    current: -0.5
                },
                {
                    to: 3,
                    current: -0.5
                },
                {
                    to: 4,
                    current: -0.5
                }
            ]
        },
        {
            voltage: 0.5,
            connections: [
                {
                    to: 0,
                    current: -0.5
                },
                {
                    to: 1,
                    current: 0.5
                }
            ]
        },
        {
            voltage: 0.5,
            connections: [
                {
                    to: 0,
                    current: -0.5
                },
                {
                    to: 1,
                    current: 0.5
                }
            ]
        },
        {
            voltage: 0.5,
            connections: [
                {
                    to: 0,
                    current: -0.5
                },
                {
                    to: 1,
                    current: 0.5
                }
            ]
        }
    ]
}

// This function performs sanity checks on a given result of the circuit solver.
// It logs a message to the console for each error it finds.
function checkResult(result) {
    // Check if there are any numerical errors: undefined/NaNs
    for (let i = 0; i < result.length; i++) {
        if (isNaN(result[i].voltage)) {
            console.log(`Node ${i} has an undefined voltage`);
        }
        for (let j = 0; j < result[i].connections.length; j++) {
            if (isNaN(result[i].connections[j].current)) {
                console.log(`Node ${i} has an undefined current`);
            }
        }
    }
    // Check for Kirchoff's voltage law
    for (let i = 0; i < result.length; i++) {
        let voltageSum = 0;
        for (let j = 0; j < result[i].connections.length; j++) {
            voltageSum += result[result[i].connections[j].to].voltage - result[i].voltage;
        }
        if (Math.abs(voltageSum) > 0.0000001) {
            console.log(`Kirchoff's voltage law is violated at node ${i}`);
        }
    }
    // Check for Kirchoff's current law
    for (let i = 0; i < result.length; i++) {
        let currentSum = 0;
        for (let j = 0; j < result[i].connections.length; j++) {
            currentSum += result[i].connections[j].current;
        }
        if (Math.abs(currentSum) > 0.0000001) {
            console.log(`Kirchoff's current law is violated at node ${i}`);
        }
    }
}




// This function compares the result of the circuit solver with the expected result of a given example.
// It returns the average absolute error of the voltages and currents, as well their maximum absolute errors.
function compareResult(truth, result) {
    let voltageError = 0;
    let currentError = 0;
    let maxVoltageError = 0;
    let maxCurrentError = 0;
    for (let i = 0; i < truth.length; i++) {
        let voltageDiff = truth[i].voltage - result[i].voltage;
        voltageError += Math.abs(voltageDiff);
        if (Math.abs(voltageDiff) > maxVoltageError) {
            maxVoltageError = Math.abs(voltageDiff);
        }
        for (let j = 0; j < truth[i].connections.length; j++) {
            let currentDiff = truth[i].connections[j].current - result[i].connections[j].current;
            currentError += Math.abs(currentDiff);
            if (Math.abs(currentDiff) > maxCurrentError) {
                maxCurrentError = Math.abs(currentDiff);
            }
        }
    }
    return {
        voltageError: voltageError / truth.length,
        currentError: currentError / truth.length,
        maxVoltageError: maxVoltageError,
        maxCurrentError: maxCurrentError
    };
}

let test2 = solver.solveResistiveCircuit(example2.circuit, example2.groundNode, example2.sourceNode, example2.sourceVoltage);

// console.log(test2);
// Inspect test2
console.log(util.inspect(test2, {showHidden: false, depth: null, colors: true}))

checkResult(test2);
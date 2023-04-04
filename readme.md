# js-circuit-solver
Lightweight library aimed at solving/simulating simple electrical circuits

# Install

Available as an npm package as `js-circuit-solver`
Run:
`npm install js-circuit-solver`

## solveResistiveCircuit

This library provides a function to solve simple resistive circuits. It takes in a circuit object and returns a solved circuit object.\

Usage:
`function solveResistiveCircuit(circuit, groundNode, sourceNode, sourceVoltage)`
- circuit: Object containing circuit information. Array where element at index i is the array of the connections that node i has with other nodes.
- groundNode: Node to be considered as ground
- sourceNode: Node to be considered as source
- sourceVoltage: Voltage of the source node

### Circuit Object

The following is an example circuit consisting of the source and ground nodes connected by 3 parallel branches each having 2 resistors.
Example circuit diagram:
```
        |---R1---R2---|
        |             |
        S---R3---R4---G
        |             |
        |---R5---R6---|
```

Example circuit object: (source node is 0, ground node is 1)
```
[
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
]
```
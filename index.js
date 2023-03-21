// The following code calculates the voltage and current at each node in a circuit.
const mathjs = require('mathjs'); // Used to solve the system of linear equations.
const utils = require('./utils');

// This function uses the classical matrix inversion method to solve a given circuit.
// It only supports circuit made entierly of resistors.
// The circuit is represented as an adjacency list of nodes and the resistance of the connections between them. Nodes can have any number of connections (the connections are of course bidirectional).
function solveResistiveCircuit(circuit, groundNode, sourceNode, sourceVoltage, useGpu=false) {
    // We will set up a system of linear equations where the unknowns are the voltages of the circuit.
    // The system of linear equations will be represented as an array of arrays of numbers.
    // We will then solve the equation M * x = b, where x is the vector of unknown voltages, M is the matrix of coefficients, and b is the vector of constants.
    
    // We create the matrix M and the vector b.
    let M = Array(circuit.length).fill().map(() => Array(circuit.length).fill(0));
    let b = Array(circuit.length).fill(0);
    
    // We set up the first equation of the system of linear equations.
    // The first equation is the equation for the ground node.
    // The ground node is the node where we set the voltage to zero, so we set the first equation to be V_gnd = 0.
    M[groundNode][groundNode] = 1;
    b[groundNode] = 0;
    
    // We set up the second equation of the system of linear equations.
    // The second equation is the equation for the voltage source node.
    // The voltage source node is the node where we set the voltage to a specific value, so we set the second equation to be V_src = sourceVoltage.
    M[sourceNode][sourceNode] = 1;
    b[sourceNode] = sourceVoltage;
    
    // We set up the equations corresponding to Kirchhoff's current law.
    //     1
    //     |
    //     2
    //   /   \
    //  3     4
    // 
    // Then the equation for node 2 in terms of the currents is:
    // I_12 - I_23 - I_24 = 0
    // The equation in terms of the voltages using the resistances is:
    // (V_1 - V_2) / R_12 + (V_2 - V_3) / R_23 + (V_2 - V_4) / R_24 = 0

    // We loop through all the nodes in the circuit.
    for (let i = 0; i < circuit.length; i++) {
        // We skip the first two equations, since they are already set up.
        if (i === groundNode || i === sourceNode) continue;
        
        // We loop through all the connections of the current node.
        for (let j = 0; j < circuit[i].length; j++) {
            // We get the node that the current connection connects to.
            let connection = circuit[i][j];
            let to = connection.to;
            
            // We set up the coefficient for the voltage of the current node.
            M[i][i] += 1 / connection.resistance;
            
            // We set up the coefficient for the voltage of the node that the current connection connects to.
            M[i][to] -= 1 / connection.resistance;
        }

        // We set up the constant for the current node.
        b[i] = 0;
    }

    // We solve the system of linear equations.
    let x = utils.solveLinearEquations(M, b, useGpu);

    // We create an array to store the results.
    let results = [];

    // We loop through all the nodes in the circuit.
    for (let i = 0; i < circuit.length; i++) {
        // We create an object to store the results for the current node.
        let result = {
            voltage: x[i],
            connections: []
        };

        // We loop through all the connections of the current node.
        for (let j = 0; j < circuit[i].length; j++) {
            // We get the node that the current connection connects to.
            let connection = circuit[i][j];
            let to = connection.to;

            // We calculate the current flowing through the current connection.
            let current = (x[i] - x[to]) / connection.resistance;

            // We add the current to the results for the current node.
            result.connections.push({
                to: to,
                current: current
            });
        }

        // We add the results for the current node to the array of results.
        results.push(result);
    }

    // We return the array of results.
    return results;
}

// This function uses a gradient descent method to solve a given circuit.
// It only supports circuit made entierly of resistors.
function solveGradientDescent(circuit, groundNode, sourceNode, sourceVoltage, iterations = 1000, learningRate = 0.001) {
    // A loop will calculate the sum of the currents flowing into each node. The sum should converge to zero for each node at equilibrium (Kirchhoff's current law).

    // We create an array to store the voltages of each node.
    let voltages = Array(circuit.length).fill(0);
    // Set the known voltages.
    voltages[groundNode] = 0;
    voltages[sourceNode] = sourceVoltage;

    // Loop for the specified number of iterations. Each iteration will update the voltages of each node.
    for (let i = 0; i < iterations; i++) {
        let error = 0; // We will use this variable to calculate the total error of the circuit.

        // We loop through all the nodes in the circuit.
        for (let j = 0; j < circuit.length; j++) {
            // We skip only nodes that we already know the voltage of (Kirchhoff's current law does not apply to ground node and voltage source node).
            if (j === groundNode || j === sourceNode) continue;

            // We calculate the sum of the currents flowing into the current node.
            let currentSum = 0;
            for (let k = 0; k < circuit[j].length; k++) {
                // We get the node that the current connection connects to.
                let connection = circuit[j][k];
                let to = connection.to;

                // We calculate the current flowing into the current node. If the voltage of the node that the current connection connects to is greater than the voltage of the current node, the current will be positive. If the voltage of the node that the current connection connects to is less than the voltage of the current node, the current will be negative.
                let current = (voltages[to] - voltages[j]) / connection.resistance;

                // We add the current to the sum.
                currentSum += current;

                // The error term is the square of the sum of the currents
                error += current * current;
                
            }

            // We update the voltages of all the nodes connected to the current node so that the sum of the currents flowing into the current node will converge to zero.
            for (let k = 0; k < circuit[j].length; k++) {
                // Skip the ground node and voltage source node.
                if (k === groundNode || k === sourceNode) continue;

                // We get the node that the current connection connects to.
                let connection = circuit[j][k];
                let to = connection.to;

                // We calculate the current flowing into the current node. If the voltage of the node that the current connection connects to is greater than the voltage of the current node, the current will be positive. If the voltage of the node that the current connection connects to is less than the voltage of the current node, the current will be negative.
                let current = (voltages[to] - voltages[j]) / connection.resistance;

                // We update the voltage of the node that the current connection connects to.
                voltages[to] -= learningRate * currentSum * (1 / connection.resistance);
            }
            
        }

        // We print the error of the circuit every 100 iterations.
        if (i % 100 === 0) {
            console.log(`Error: ${error}`);
        }
    }

    // We create an array to store the results.
    let results = [];

    // We loop through all the nodes in the circuit.
    for (let i = 0; i < circuit.length; i++) {
        // We create an object to store the results for the current node.
        let result = {
            voltage: voltages[i],
            connections: []
        };

        // We loop through all the connections of the current node.
        for (let j = 0; j < circuit[i].length; j++) {
            // We get the node that the current connection connects to.
            let connection = circuit[i][j];
            let to = connection.to;

            // We calculate the current flowing through the current connection.
            let current = (voltages[i] - voltages[to]) / connection.resistance;

            // We add the current to the results for the current node.
            result.connections.push({
                to: to,
                current: current
            });
        }

        // We add the results for the current node to the array of results.
        results.push(result);
    }

    // We return the array of results.
    return results;
}



// Export the function.
module.exports = {
    solveResistiveCircuit: solveResistiveCircuit,
    solveGradientDescent: solveGradientDescent
};
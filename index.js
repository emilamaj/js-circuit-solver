// The following code calculates the voltage and current at each node in a circuit.
import { solve } from 'mathjs'; // Used to solve the system of linear equations.

// This function uses the classical matrix inversion method to solve a given circuit.
// It only supports circuit made entierly of resistors.
// The circuit is represented as an adjacency list of nodes and the resistance of the connections between them. Nodes can have any number of connections (the connections are of course bidirectional).
function solveResistiveCircuit(circuit, groundNode, voltageSourceNode, voltageSourceVoltage) {
    // We will set up a system of linear equations where the unknowns are the voltages and currents of the circuit.
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
    // The voltage source node is the node where we set the voltage to a specific value, so we set the second equation to be V_src = voltageSourceVoltage.
    M[voltageSourceNode][voltageSourceNode] = 1;
    b[voltageSourceNode] = voltageSourceVoltage;
    
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
        if (i === groundNode || i === voltageSourceNode) continue;
        
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
    let x = solve(M, b);

    // We create an array to store the results.
    let results = [];

    // We loop through all the nodes in the circuit.
    for (let i = 0; i < circuit.length; i++) {
        // We create an object to store the results for the current node.
        let result = {
            id: i,
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
                id: to,
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
export { solveResistiveCircuit };
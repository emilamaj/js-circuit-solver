const mathjs = require('mathjs');
const GPU = require('gpu.js');

// The following function uses an iterative method to calculate the inverse of a matrix. The method is based on the following formula:
// A^-1 = A^-1 + (I - A*A^-1)/2
// It is applied iteratively until the desired precision is reached. Experimentaly, A.A^-1 = I with a precision of 10^-6 after 1 iteration.
function simpleInverse(A, iterations=1) {
    // We create a matrix to store the result.
    let result = mathjs.identity(A.length);

    for (let i = 0; i < iterations; i++) {
        // We calculate the next iteration of the result using the formula A^-1 = A^-1 + (I - A*A^-1)/2
        result = mathjs.add(result, mathjs.multiply(mathjs.subtract(mathjs.identity(A.length), mathjs.multiply(A, result)), 0.5));

        // We calculate the next iteration of the result using the formula A^-1 = A^-1 + (I - A*A^-1)*(A - A*A^-1)/2 (Used by the GSL library)
        // result = mathjs.add(result, mathjs.multiply(mathjs.subtract(mathjs.identity(A.length), mathjs.multiply(A, result)), mathjs.multiply(mathjs.subtract(A, mathjs.multiply(A, result)), 0.5)));

        // We calculate the next iteration of the result using the formula A^-1 = A^-1 + (I - A*A^-1)*(A - A*A^-1)*(A - A*A^-1)/2
        // result = mathjs.add(result, mathjs.multiply(mathjs.subtract(mathjs.identity(A.length), mathjs.multiply(A, result)), mathjs.multiply(mathjs.subtract(A, mathjs.multiply(A, result)), mathjs.multiply(mathjs.subtract(A, mathjs.multiply(A, result)), 0.5))));
    }

    // We return the result.
    return result.toArray();
}

// This function uses GPU acceleration to calculate the inverse of a matrix, using gpu.js.
function gpuInverse(A) {
    // Check if GPU acceleration is available.
    if (!GPU.isGPUSupported) {
        console.log('GPU acceleration is not supported.');
    }

    // We create a new GPU instance.
    const gpu = new GPU.GPU(); // 

    // We create a function to calculate the next iteration of the result using the formula A^-1 = A^-1 + (I - A*A^-1)/2
    const kernel = gpu.createKernel(function(A, result) {
        return result[this.thread.y][this.thread.x] + (1 - A[this.thread.y][this.thread.x] * result[this.thread.y][this.thread.x]) / 2;
    })
    .setOutput([A.length, A.length]);

    // We create a matrix to store the result.
    let result = mathjs.identity(A.length).toArray();

    // We calculate the next iteration of the result using the formula A^-1 = A^-1 + (I - A*A^-1)/2
    result = kernel(A, result);

    // We return the result.
    return result;
}

// GPU Accelerated multiplication
function gpuMultiply(A, B) {
    // Check if GPU acceleration is available.
    if (!GPU.isGPUSupported) {
        console.log('GPU acceleration is not supported.');
    }

    let n = A.length; // Here, A.length is used because the two matrices have the same size. If they didn't, you could use a[0].length or b.length.
    const gpu = new GPU.GPU();

    // createKernel() converts the function into a kernel that can be executed on the GPU.
    const multiplyMatrix = gpu.createKernel(function(a, b, n) { // Here, a and b are the two matrices to be multiplied. The function returns the dot product of the two matrices.
    let sum = 0;
    for (let i = 0; i < n; i++) {
        sum += a[this.thread.y][i] * b[i][this.thread.x];
    }
    return sum;
    }).setOutput([n, n]);

    
    const out = multiplyMatrix(A, B, n);
    return out;
}

// Solve a system of linear equations using the inverse of a matrix. Equation in the form : Ax = b
function solveLinearEquations(A, b, useGpu) {
    let inverse;

    // We calculate the inverse of the matrix A.
    if (useGpu) {
        inverse = gpuInverse(A);
    }else {
        // inverse = simpleInverse(A);
        inverse = mathjs.inv(A);
    }

    // We multiply the inverse of A by b.
    const result = mathjs.multiply(inverse, b);

    // We return the result.
    return result;
}


// Export functions
module.exports = {
    simpleInverse: simpleInverse,
    gpuInverse: gpuInverse,
    gpuMultiply: gpuMultiply,
    solveLinearEquations: solveLinearEquations
};
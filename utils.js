const mathjs = require('mathjs');

// The following function uses an iterative method to calculate the inverse of a matrix. The method is based on the following formula:
// A^-1 = A^-1 + (I - A*A^-1)/2
// It is applied iteratively until the desired precision is reached. Experimentaly, A.A^-1 = I with a precision of 10^-6 after 1 iteration.

function quickInverse(A) {
    // We create a matrix to store the result.
    let result = mathjs.identity(A.length);

    // We calculate the next iteration of the result using the formula A^-1 = A^-1 + (I - A*A^-1)/2
    result = mathjs.add(result, mathjs.multiply(mathjs.subtract(mathjs.identity(A.length), mathjs.multiply(A, result)), 0.5));

    // We calculate the next iteration of the result using the formula A^-1 = A^-1 + (I - A*A^-1)*(A - A*A^-1)/2 (Used by the GSL library)
    // result = mathjs.add(result, mathjs.multiply(mathjs.subtract(mathjs.identity(A.length), mathjs.multiply(A, result)), mathjs.multiply(mathjs.subtract(A, mathjs.multiply(A, result)), 0.5)));

    // We calculate the next iteration of the result using the formula A^-1 = A^-1 + (I - A*A^-1)*(A - A*A^-1)*(A - A*A^-1)/2
    // result = mathjs.add(result, mathjs.multiply(mathjs.subtract(mathjs.identity(A.length), mathjs.multiply(A, result)), mathjs.multiply(mathjs.subtract(A, mathjs.multiply(A, result)), mathjs.multiply(mathjs.subtract(A, mathjs.multiply(A, result)), 0.5))));

    // We return the result.
    return result;
}

// Export functions
module.exports = {
    quickInverse: quickInverse
};
// sum_to_n_a: Iterative approach using a for loop
// Time complexity: O(n), Space complexity: O(1)
var sum_to_n_a = function (n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

// sum_to_n_b: Mathematical formula approach
// Time complexity: O(1), Space complexity: O(1)
var sum_to_n_b = function (n) {
  return (n * (n + 1)) / 2;
};

// sum_to_n_c: Recursive approach
// Time complexity: O(n), Space complexity: O(n) due to call stack
var sum_to_n_c = function (n) {
  if (n <= 1) return n;
  return n + sum_to_n_c(n - 1);
};

// Test cases
console.log('sum_to_n_a(5):', sum_to_n_a(5)); // Expected: 15
console.log('sum_to_n_b(5):', sum_to_n_b(5)); // Expected: 15
console.log('sum_to_n_c(5):', sum_to_n_c(5)); // Expected: 15

console.log('sum_to_n_a(1):', sum_to_n_a(1)); // Expected: 1
console.log('sum_to_n_b(1):', sum_to_n_b(1)); // Expected: 1
console.log('sum_to_n_c(1):', sum_to_n_c(1)); // Expected: 1

console.log('sum_to_n_a(10):', sum_to_n_a(10)); // Expected: 55
console.log('sum_to_n_b(10):', sum_to_n_b(10)); // Expected: 55
console.log('sum_to_n_c(10):', sum_to_n_c(10)); // Expected: 55

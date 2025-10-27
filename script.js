function find_second_largest_unique(arr) {
    if (!arr || arr.length === 0) return -1;
    const unique_nums = [...new Set(arr)].sort((a, b) => a - b);
    return unique_nums.length < 2 ? -1 : unique_nums.at(-2);
}

console.log(find_second_largest_unique([3, 5, 2, 5, 6, 6, 1]));

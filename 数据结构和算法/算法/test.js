function quickSort(arr, start, end) {
    if ((end - start) < 1) {
        return;
    }
    const target = arr[start];
    let left = start;
    let right = end
    while (left < right) {
        while (left < right && arr[right] >= target) {
            right--;
        }
        arr[left] = arr[right]
        while (left < right && arr[left] < target) {
            left++
        }
        arr[right] = arr[left]
    }
    arr[left] = target
    quickSort(arr, start, left - 1)
    quickSort(arr, left + 1, end)
    return arr
}

function mergeSort(array) {
    if (array.length < 2) {
        return array;
    }
    const mid = Math.floor(array.length / 2);
    const front = array.slice(0, mid);
    const end = array.slice(mid);
    console.log(mergeSort(front))
    return merge(mergeSort(front), mergeSort(end));
}

function merge(front, end) {
    const temp = [];
    while (front.length && end.length) {
        if (front[0] < end[0]) {
            temp.push(front.shift());
        } else {
            temp.push(end.shift());
        }
    }
    while (front.length) {
        temp.push(front.shift());
    }
    while (end.length) {
        temp.push(end.shift());
    }
    return temp;
}
let arr = [1, 3, 6, 5, 4, 3, 2, 1]
mergeSort(arr)
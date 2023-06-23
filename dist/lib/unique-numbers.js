function generateUniqueRandomNumbers(len) {
    var arr = [];
    while (arr.length < len) {
        var r = Math.floor(Math.random() * 75) + 1;
        var exists = false;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === r) {
                exists = true;
                break;
            }
        }
        if (!exists)
            arr.push(r);
    }
    return arr;
}

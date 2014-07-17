function boolToString(bool) {
    if (bool) {
        return 'true';
    } else {
        return 'false';
    }
}
console.log(boolToString(Math.random() > 0.5));

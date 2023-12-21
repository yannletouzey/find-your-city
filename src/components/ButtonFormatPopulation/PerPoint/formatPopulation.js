export const formatPopulation = (num) => {
    num = num.toString();
    let one = num.substring(num.length - 3, num.length);
    let two = num.substring(num.length - 6, num.length - 3);
    let three = num.substring(num.length - 9, num.length - 6);
    if (num.length > 3 && num.length <= 6) {
        return num = two + "," + one
    } else if (num.length > 6) {
        return num = three + "," + two + "," + one
    } else {
        return num
    }
}

const sanitiseStr = (str) => {
    // Removing white spaces
    str = str.replace(/\s+/g,' ').trim();

    // 30 limit word
    const strArr = str.split(" ").map(word => {
        if(word.length > 30) {
            return word.substring(0, 30);
        } else {
            return word;
        }
    });
    return strArr.join(" ");
}

export default sanitiseStr;
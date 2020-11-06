

export function numberWithCommas(x){
	var parts = x.toString().split(".");
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return parts.join(".");
}

//encode string to number with prefix "0x"
export function encodeToString(string) {
    var number = "0x";
    var length = string.length;
    for (var i = 0; i < length; i++)
        number += string.charCodeAt(i).toString(16);
    return number;
}

//limit decimal places to 2
export const twoDecimalPlaces = (num) => {
	return Math.floor(num * 100) / 100
}

/*
check if number starts at 0

00001 = invalid number
0.01 = valid number
*/
export const leadingZero = (num) => {
	var regExp = /^0[0-9].*$/,
		string = num.toString();

	return regExp.test(string);

}

export const MY_APP = require('../../package.json');

export const detectMob = () => {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];

    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}
// Copyright (c) 2024 by Sahil Parmar (https://codepen.io/Sahil-Parmar/pen/KKEPvVd)
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// 하단의 코드는 프로젝트에 맞게 수정

$(document).ready(function() {
    // Controls the slider using from Input....
    function controlFromInput(fromSlider, fromInput, toInput, controlSlider) {
        const [from, to] = getParsed(fromInput, toInput);
        fillSlider(fromInput, toInput, "var(--Pantone877C)", "var(--CnuBlue)", controlSlider);
        fromSlider.value = from;

        if (from > to) {
            fromSlider.value = to;
            fromInput.value = to;
        } else {
            fromSlider.value = from;
        }
    }

    // Controls the slider using to Input....
    function controlToInput(toSlider, fromInput, toInput, controlSlider) {
        const [from, to] = getParsed(fromInput, toInput);
        fillSlider(fromInput, toInput, "var(--Pantone877C)", "var(--CnuBlue)", controlSlider);
        setToggleAccessible(toInput);
        toSlider.value = to;
        toInput.value = to;

        if (from <= to) {
            toSlider.value = to;
            toInput.value = to;
        } else {
            toInput.value = from;
        }
    }

    // Sliding event of the From slider
    function controlFromSlider(fromSlider, toSlider, fromInput) {
        const [from, to] = getParsed(fromSlider, toSlider);
        // console.log([from, to]);
        fillSlider(fromSlider, toSlider, "var(--Pantone877C)", "var(--CnuBlue)", toSlider);
        fromInput.value = from;
        if (from > to) {
            fromInput.value = to;
            toInput.value = from;
        }
    }

    // Sliding event of the To slider
    function controlToSlider(fromSlider, toSlider, toInput) {
        const [from, to] = getParsed(fromSlider, toSlider);
        fillSlider(fromSlider, toSlider, "var(--Pantone877C)", "var(--CnuBlue)", toSlider);
        setToggleAccessible(toSlider);
        toSlider.value = to;
        toInput.value = to;
        if (from > to) {
            fromInput.value = to;
            toInput.value = from;
        }
    }

    // Parsign values of the Inputs
    function getParsed(currentFrom, currentTo) {
        const from = parseInt(currentFrom.value, 10);
        const to = parseInt(currentTo.value, 10);
        return [from, to];
    }

    // Changing and Filling the color in the selected part...
    function fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
        let rangeDistance = to.max - to.min;
        let fromPosition = from.value - to.min;
        let toPosition = to.value - to.min;
        if (fromPosition > toPosition) {
            let spare = fromPosition;
            fromPosition = toPosition;
            toPosition = spare;
        }
        controlSlider.style.background = `linear-gradient(
                to right,
                ${sliderColor} 0%,
                ${sliderColor} ${(fromPosition / rangeDistance) * 100}%,
                ${rangeColor} ${(fromPosition / rangeDistance) * 100}%,
                ${rangeColor} ${(toPosition / rangeDistance) * 100}%, 
                ${sliderColor} ${(toPosition / rangeDistance) * 100}%, 
                ${sliderColor} 100%)`;
    }

    // Making sure the toggle which we are using is accesible to change the range
    function setToggleAccessible(currentTarget) {
        const toSlider = document.querySelector("#toSlider");
        if (Number(currentTarget.value) <= 0) {
            toSlider.style.zIndex = 2;
        } else {
            toSlider.style.zIndex = 0;
        }
    }

    const fromSlider = document.querySelector("#fromSlider");
    const toSlider = document.querySelector("#toSlider");
    const fromInput = document.querySelector("#fromInput");
    const toInput = document.querySelector("#toInput");

    // Initially filling the slider using default values...
    fillSlider(fromSlider, toSlider, "var(--Pantone877C)", "var(--CnuBlue)", toSlider);
    setToggleAccessible(toSlider);

    // Assigning listner methonds to respective events.
    fromSlider.oninput = () => controlFromSlider(fromSlider, toSlider, fromInput);
    toSlider.oninput = () => controlToSlider(fromSlider, toSlider, toInput);
    fromInput.oninput = () =>
        controlFromInput(fromSlider, fromInput, toInput, toSlider);
    toInput.oninput = () => controlToInput(toSlider, fromInput, toInput, toSlider);
});
    const display = document.getElementById('display');

    let lastOperator = null;
    let lastOperand = null;
    let isNewCalculation = false;

    // Add ripple effect to all buttons on click
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function (e) {
            const circle = document.createElement('span');
            const diameter = Math.max(this.clientWidth, this.clientHeight);
            const radius = diameter / 2;

            const rect = this.getBoundingClientRect();
            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - rect.left - radius}px`;
            circle.style.top = `${e.clientY - rect.top - radius}px`;
            circle.classList.add('ripple');

            const ripple = this.getElementsByClassName('ripple')[0];
            if (ripple) {
                ripple.remove();
            }

            this.appendChild(circle);
        });
    });

    function appendValue(val) {
    if (isNewCalculation) {
        // If typing a new number after pressing '=', clear the screen first
        if (!isNaN(val) || val === '.') {
            display.value = '';
        }
        isNewCalculation = false;
    }
    display.value += val;
    // Reset stored repeated operation when a new input is typed manually
    lastOperator = null;
    lastOperand = null;
}
    function clearDisplay() {
        display.value = '';
        lastOperator = null;
        lastOperand = null;
        isNewCalculation = false;
    }

    function deleteLast() {
        display.value = display.value.slice(0, -1);
    }
    function calculatePercentage() {
        try {
            if (display.value) {
                display.value = eval(display.value) / 100;
                triggerPulse();
            }
        } catch (e) {
            display.value = 'Error';
            triggerPulse();
        }
    }

   function calculate() {
    try {
        if (!display.value) return;

        let expr = display.value;

        if (lastOperator !== null && lastOperand !== null) {
            // Repeat the last operator and operand if '=' is pressed sequentially
            expr = `${display.value} ${lastOperator} ${lastOperand}`;
        } else {
            // Capture the trailing operator and number from the expression
            const match = expr.match(/([\+\-\*\/\*\*])\s*([0-9\.]+)$/);
            if (match) {
                lastOperator = match[1];
                lastOperand = match[2];
            }
        }

        display.value = eval(expr);
        triggerPulse();
        isNewCalculation = true;
    } catch (e) {
        display.value = 'Error';
        triggerPulse();
    }
}

    function calculateSquareRoot() {
    try {
        if (display.value) {
            const currentVal = eval(display.value);
            if (currentVal < 0) {
                display.value = 'Error';
            } else {
                display.value = Math.sqrt(currentVal);
            }
            triggerPulse();
            isNewCalculation = true;
        }
    } catch (e) {
        display.value = 'Error';
        triggerPulse();
    }
}
    function triggerPulse() {
        display.classList.add('pulse');
        void display.offsetWidth; // Trigger reflow to restart the animation
        display.classList.remove('pulse');
    }
    // Physical Keyboard Listener with Visual Button Feedback
document.addEventListener('keydown', function(event) {
    const key = event.key;
    let buttonSelector = null;

    // Handle Number keys (0-9) and Decimal point
    if ((key >= '0' && key <= '9') || key === '.') {
        appendValue(key);
        buttonSelector = `button[onclick="appendValue('${key}')"]`;
    }
    // Handle standard operators
    else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendValue(key);
        buttonSelector = `button[onclick="appendValue('${key}')"]`;
    }
    // Handle exponentiation key (Caret '^')
    else if (key === '^') {
        appendValue('**');
        buttonSelector = `button[onclick="appendValue('**')"]`;
    }
    // Handle Percentage
    else if (key === '%') {
        calculatePercentage();
        buttonSelector = `button[onclick="calculatePercentage()"]`;
    }
    // Handle Equals / Enter
    else if (key === 'Enter' || key === '=') {
        event.preventDefault(); // Prevents triggering default button re-presses
        calculate();
        buttonSelector = `button[onclick="calculate()"]`;
    }
    // Handle Backspace (Delete last digit)
    else if (key === 'Backspace') {
        deleteLast();
        buttonSelector = `button[onclick="deleteLast()"]`;
    }
    // Handle Escape or 'c' / 'C' (Clear display)
    else if (key === 'Escape' || key.toLowerCase() === 'c') {
        clearDisplay();
        buttonSelector = `button[onclick="clearDisplay()"]`;
    }

    // Trigger physical button visual feedback
    if (buttonSelector) {
        const targetButton = document.querySelector(buttonSelector);
        if (targetButton) {
            triggerButtonVisual(targetButton);
        }
    }
});

// Function to animate the button when activated by physical keypress
function triggerButtonVisual(btn) {
    // 1. Add keypress highlight style
    btn.classList.add('keyboard-active');

    // 2. Trigger visual ripple effect
    const circle = document.createElement('span');
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${btn.clientWidth / 2 - radius}px`;
    circle.style.top = `${btn.clientHeight / 2 - radius}px`;
    circle.classList.add('ripple');

    const existingRipple = btn.getElementsByClassName('ripple')[0];
    if (existingRipple) {
        existingRipple.remove();
    }
    btn.appendChild(circle);

    // 3. Remove highlight style after release animation
    setTimeout(() => {
        btn.classList.remove('keyboard-active');
    }, 150);
}


let currentPage = 1;

function togglePage() {
    const wrapper = document.getElementById('pages-wrapper');
    const title = document.getElementById('page-title');

    if (currentPage === 1) {
        wrapper.classList.add('show-page-2');
        title.textContent = 'Scientific';
        currentPage = 2;
    } else {
        wrapper.classList.remove('show-page-2');
        title.textContent = 'Standard';
        currentPage = 1;
    }
}

// Helper for scientific functions like sin, cos, log
function appendMathFunc(funcName) {
    if (isNewCalculation) {
        display.value = '';
        isNewCalculation = false;
    }
    display.value += `${funcName}(`;
}

// Factorial function (n!)
function calculateFactorial() {
    try {
        if (!display.value) return;
        let num = parseInt(eval(display.value));
        if (num < 0) {
            display.value = 'Error';
            return;
        }
        let result = 1;
        for (let i = 2; i <= num; i++) result *= i;
        display.value = result;
        triggerPulse();
        isNewCalculation = true;
    } catch (e) {
        display.value = 'Error';
        triggerPulse();
    }
}
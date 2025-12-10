// Add this at the beginning of your existing script.js
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Device is ready, initialize app
    console.log('Device is ready');
    
    // Prevent zoom on double tap
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Prevent context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });
}

// Add haptic feedback for button presses (if available)
function addHapticFeedback() {
    if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50); // 50ms vibration
    }
}

// Modify your existing functions to include haptic feedback
const originalAppendToDisplay = appendToDisplay;
appendToDisplay = function(value) {
    addHapticFeedback();
    originalAppendToDisplay(value);
};

const originalCalculate = calculate;
calculate = function() {
    addHapticFeedback();
    originalCalculate();
};

// [Rest of your existing JavaScript code goes here...]
// [Include all the functions from the previous scientific calculator]

let display = document.getElementById('display');
let history = document.getElementById('history');
let memoryIndicator = document.getElementById('memoryIndicator');
let angleMode = document.getElementById('angleMode');

let memory = 0;
let isRadians = false;
let lastResult = 0;

// Mathematical constants
const constants = {
    'π': Math.PI,
    'e': Math.E
};

function appendToDisplay(value) {
    addHapticFeedback();
    if (display.value === '0' && value !== '.' && !isNaN(value)) {
        display.value = value;
    } else {
        display.value += value;
    }
}

function appendFunction(func) {
    addHapticFeedback();
    if (display.value === '0') {
        display.value = func;
    } else {
        display.value += func;
    }
}

function clearDisplay() {
    addHapticFeedback();
    display.value = '';
    history.textContent = '';
}

function clearEntry() {
    addHapticFeedback();
    display.value = '';
}

function deleteLast() {
    addHapticFeedback();
    display.value = display.value.slice(0, -1);
}

function changeSign() {
    addHapticFeedback();
    if (display.value && display.value !== '0') {
        if (display.value.startsWith('-')) {
            display.value = display.value.substring(1);
        } else {
            display.value = '-' + display.value;
        }
    }
}

function toggleAngleMode() {
    addHapticFeedback();
    isRadians = !isRadians;
    angleMode.textContent = isRadians ? 'RAD' : 'DEG';
    document.querySelector('.mode').textContent = isRadians ? 'RAD' : 'DEG';
}

// Memory functions
function memoryClear() {
    addHapticFeedback();
    memory = 0;
    memoryIndicator.classList.remove('active');
}

function memoryRecall() {
    addHapticFeedback();
    display.value = memory.toString();
}

function memoryAdd() {
    addHapticFeedback();
    try {
        let currentValue = parseFloat(evaluateExpression(display.value));
        if (!isNaN(currentValue)) {
            memory += currentValue;
            memoryIndicator.classList.add('active');
        }
    } catch (error) {
        // Handle error silently
    }
}

function memorySubtract() {
    addHapticFeedback();
    try {
        let currentValue = parseFloat(evaluateExpression(display.value));
        if (!isNaN(currentValue)) {
            memory -= currentValue;
            memoryIndicator.classList.add('active');
        }
    } catch (error) {
        // Handle error silently
    }
}

// [Include all other functions from the previous scientific calculator...]

function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function toDegrees(radians) {
    return radians * (180 / Math.PI);
}

function evaluateExpression(expression) {
    // Replace constants
    for (let constant in constants) {
        expression = expression.replace(new RegExp(constant, 'g'), constants[constant]);
    }
    
    // Replace scientific functions
    expression = expression.replace(/sin\(/g, isRadians ? 'Math.sin(' : 'Math.sin(toRadians(');
    expression = expression.replace(/cos\(/g, isRadians ? 'Math.cos(' : 'Math.cos(toRadians(');
    expression = expression.replace(/tan\(/g, isRadians ? 'Math.tan(' : 'Math.tan(toRadians(');
    
    expression = expression.replace(/asin\(/g, isRadians ? 'Math.asin(' : 'toDegrees(Math.asin(');
    expression = expression.replace(/acos\(/g, isRadians ? 'Math.acos(' : 'toDegrees(Math.acos(');
    expression = expression.replace(/atan\(/g, isRadians ? 'Math.atan(' : 'toDegrees(Math.atan(');
    
    expression = expression.replace(/log\(/g, 'Math.log10(');
    expression = expression.replace(/ln\(/g, 'Math.log(');
    expression = expression.replace(/sqrt\(/g, 'Math.sqrt(');
    expression = expression.replace(/cbrt\(/g, 'Math.cbrt(');
    
    // Handle power operations
    expression = expression.replace(/\^/g, '**');
    
    // Handle factorial
    expression = expression.replace(/(\d+\.?\d*)!/g, 'factorial($1)');
    
    // Handle percentage
    expression = expression.replace(/(\d+\.?\d*)%/g, '($1/100)');
    
    // Close parentheses for trigonometric functions if not in radians
    if (!isRadians) {
        expression = expression.replace(/Math\.sin\(toRadians\(([^)]+)\)/g, 'Math.sin(toRadians($1))');
        expression = expression.replace(/Math\.cos\(toRadians\(([^)]+)\)/g, 'Math.cos(toRadians($1))');
        expression = expression.replace(/Math\.tan\(toRadians\(([^)]+)\)/g, 'Math.tan(toRadians($1))');
        expression = expression.replace(/toDegrees\(Math\.asin\(([^)]+)\)/g, 'toDegrees(Math.asin($1))');
        expression = expression.replace(/toDegrees\(Math\.acos\(([^)]+)\)/g, 'toDegrees(Math.acos($1))');
        expression = expression.replace(/toDegrees\(Math\.atan\(([^)]+)\)/g, 'toDegrees(Math.atan($1))');
    }
    
    return eval(expression);
}

function calculate() {
    addHapticFeedback();
    try {
        let expression = display.value;
        if (expression === '') return;
        
        // Store the expression for history
        let originalExpression = expression;
        
        let result = evaluateExpression(expression);
        
        // Handle special cases
        if (!isFinite(result)) {
            display.value = 'Error';
            return;
        }
        
        // Round to avoid floating point precision issues
        result = Math.round(result * 1e10) / 1e10;
        
        // Update history
        history.textContent = originalExpression + ' =';
        
        display.value = result;
        lastResult = result;
        
    } catch (error) {
        display.value = 'Error';
        history.textContent = '';
    }
}

// Initialize memory indicator
memoryIndicator.classList.remove('active');
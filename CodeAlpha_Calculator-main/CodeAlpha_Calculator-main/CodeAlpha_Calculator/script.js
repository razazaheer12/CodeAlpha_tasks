        class Calculator {
            constructor(previousOperandElement, currentOperandElement) {
                this.previousOperandElement = previousOperandElement;
                this.currentOperandElement = currentOperandElement;
                this.clear();
            }

            clear() {
                this.currentOperand = '0';
                this.previousOperand = '';
                this.operation = undefined;
                this.updateDisplay();
            }

            delete() {
                if (this.currentOperand === '0') return;
                this.currentOperand = this.currentOperand.toString().slice(0, -1);
                if (this.currentOperand === '' || this.currentOperand === '-') {
                    this.currentOperand = '0';
                }
                this.updateDisplay();
            }

            appendNumber(number) {
                if (number === '.' && this.currentOperand.includes('.')) return;
                if (this.currentOperand === '0' && number !== '.') {
                    this.currentOperand = number.toString();
                } else {
                    this.currentOperand = this.currentOperand.toString() + number.toString();
                }
                this.updateDisplay();
            }

            chooseOperation(operation) {
                if (this.currentOperand === '') return;
                if (this.previousOperand !== '') {
                    this.compute();
                }
                this.operation = operation;
                this.previousOperand = this.currentOperand;
                this.currentOperand = '0';
                this.updateDisplay();
            }

            compute() {
                let computation;
                const prev = parseFloat(this.previousOperand);
                const current = parseFloat(this.currentOperand);
                if (isNaN(prev) || isNaN(current)) return;

                switch (this.operation) {
                    case '+':
                        computation = prev + current;
                        break;
                    case '−':
                        computation = prev - current;
                        break;
                    case '×':
                        computation = prev * current;
                        break;
                    case '÷':
                        if (current === 0) {
                            alert('Cannot divide by zero!');
                            this.clear();
                            return;
                        }
                        computation = prev / current;
                        break;
                    default:
                        return;
                }

                this.currentOperand = Math.round(computation * 100000000) / 100000000;
                this.operation = undefined;
                this.previousOperand = '';
                this.updateDisplay();
            }

            getDisplayNumber(number) {
                const stringNumber = number.toString();
                const integerDigits = parseFloat(stringNumber.split('.')[0]);
                const decimalDigits = stringNumber.split('.')[1];
                let integerDisplay;
                
                if (isNaN(integerDigits)) {
                    integerDisplay = '';
                } else {
                    integerDisplay = integerDigits.toLocaleString('en', {
                        maximumFractionDigits: 0
                    });
                }
                
                if (decimalDigits != null) {
                    return `${integerDisplay}.${decimalDigits}`;
                } else {
                    return integerDisplay;
                }
            }

            updateDisplay() {
                this.currentOperandElement.textContent = this.getDisplayNumber(this.currentOperand);
                if (this.operation != null) {
                    this.previousOperandElement.textContent = 
                        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
                } else {
                    this.previousOperandElement.textContent = '';
                }
            }
        }

        const previousOperandElement = document.getElementById('previousOperand');
        const currentOperandElement = document.getElementById('currentOperand');
        const calc = new Calculator(previousOperandElement, currentOperandElement);

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key >= '0' && e.key <= '9') calc.appendNumber(e.key);
            if (e.key === '.') calc.appendNumber('.');
            if (e.key === '+') calc.chooseOperation('+');
            if (e.key === '-') calc.chooseOperation('−');
            if (e.key === '*') calc.chooseOperation('×');
            if (e.key === '/') {
                e.preventDefault();
                calc.chooseOperation('÷');
            }
            if (e.key === 'Enter' || e.key === '=') {
                e.preventDefault();
                calc.compute();
            }
            if (e.key === 'Escape') calc.clear();
            if (e.key === 'Backspace') calc.delete();
        });
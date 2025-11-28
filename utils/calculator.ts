export type CalculatorOperation = '+' | '-' | '*' | '/' | '=' | 'C' | 'CE' | 'DEL' | 
  'sin' | 'cos' | 'tan' | 'log' | 'ln' | 'sqrt' | 'pow' | 'π' | 'e' | '1/x' | 'x²' | 'x³' | '%';

export interface CalculatorState {
  display: string;
  previousValue: number | null;
  operation: CalculatorOperation | null;
  waitingForNewValue: boolean;
}

export const initialCalculatorState: CalculatorState = {
  display: '0',
  previousValue: null,
  operation: null,
  waitingForNewValue: false,
};

export function calculate(
  state: CalculatorState,
  input: string | CalculatorOperation,
  memory?: number
): CalculatorState {
  if (input === 'C') {
    return initialCalculatorState;
  }

  if (input === 'CE') {
    return {
      ...state,
      display: '0',
    };
  }

  if (input === 'DEL') {
    if (state.display.length === 1) {
      return {
        ...state,
        display: '0',
      };
    }
    return {
      ...state,
      display: state.display.slice(0, -1),
    };
  }

  // Scientific functions (unary operations)
  const currentValue = parseFloat(state.display);
  
  if (input === 'sin') {
    return {
      ...state,
      display: formatNumber(Math.sin(currentValue * Math.PI / 180)),
      waitingForNewValue: true,
    };
  }
  
  if (input === 'cos') {
    return {
      ...state,
      display: formatNumber(Math.cos(currentValue * Math.PI / 180)),
      waitingForNewValue: true,
    };
  }
  
  if (input === 'tan') {
    return {
      ...state,
      display: formatNumber(Math.tan(currentValue * Math.PI / 180)),
      waitingForNewValue: true,
    };
  }
  
  if (input === 'log') {
    return {
      ...state,
      display: formatNumber(Math.log10(currentValue)),
      waitingForNewValue: true,
    };
  }
  
  if (input === 'ln') {
    return {
      ...state,
      display: formatNumber(Math.log(currentValue)),
      waitingForNewValue: true,
    };
  }
  
  if (input === 'sqrt') {
    return {
      ...state,
      display: formatNumber(Math.sqrt(currentValue)),
      waitingForNewValue: true,
    };
  }
  
  if (input === 'x²') {
    return {
      ...state,
      display: formatNumber(currentValue * currentValue),
      waitingForNewValue: true,
    };
  }
  
  if (input === 'x³') {
    return {
      ...state,
      display: formatNumber(currentValue * currentValue * currentValue),
      waitingForNewValue: true,
    };
  }
  
  if (input === '1/x') {
    return {
      ...state,
      display: formatNumber(currentValue !== 0 ? 1 / currentValue : 0),
      waitingForNewValue: true,
    };
  }
  
  if (input === '%') {
    if (state.previousValue !== null && state.operation) {
      const percentValue = (state.previousValue * currentValue) / 100;
      let result: number;
      switch (state.operation) {
        case '+':
          result = state.previousValue + percentValue;
          break;
        case '-':
          result = state.previousValue - percentValue;
          break;
        case '*':
          result = state.previousValue * (currentValue / 100);
          break;
        case '/':
          result = currentValue !== 0 ? state.previousValue / (currentValue / 100) : 0;
          break;
        default:
          return state;
      }
      return {
        display: formatNumber(result),
        previousValue: null,
        operation: null,
        waitingForNewValue: true,
      };
    }
    return {
      ...state,
      display: formatNumber(currentValue / 100),
      waitingForNewValue: true,
    };
  }
  
  if (input === 'π') {
    return {
      ...state,
      display: formatNumber(Math.PI),
      waitingForNewValue: true,
    };
  }
  
  if (input === 'e') {
    return {
      ...state,
      display: formatNumber(Math.E),
      waitingForNewValue: true,
    };
  }
  
  if (input === 'pow') {
    if (state.previousValue === null) {
      return {
        ...state,
        previousValue: currentValue,
        operation: 'pow',
        waitingForNewValue: true,
      };
    }
    const result = Math.pow(state.previousValue, currentValue);
    return {
      display: formatNumber(result),
      previousValue: null,
      operation: null,
      waitingForNewValue: true,
    };
  }

  if (input === '=') {
    if (state.previousValue === null || state.operation === null) {
      return state;
    }

    const currentValue = parseFloat(state.display);
    let result: number;

    switch (state.operation) {
      case '+':
        result = state.previousValue + currentValue;
        break;
      case '-':
        result = state.previousValue - currentValue;
        break;
      case '*':
        result = state.previousValue * currentValue;
        break;
      case '/':
        result = currentValue !== 0 ? state.previousValue / currentValue : 0;
        break;
      default:
        return state;
    }

    return {
      display: formatNumber(result),
      previousValue: null,
      operation: null,
      waitingForNewValue: true,
    };
  }

  if (['+', '-', '*', '/'].includes(input)) {
    if (state.previousValue === null) {
      return {
        ...state,
        previousValue: parseFloat(state.display),
        operation: input as CalculatorOperation,
        waitingForNewValue: true,
      };
    }

    if (!state.waitingForNewValue) {
      const currentValue = parseFloat(state.display);
      let result: number;

      switch (state.operation) {
        case '+':
          result = state.previousValue + currentValue;
          break;
        case '-':
          result = state.previousValue - currentValue;
          break;
        case '*':
          result = state.previousValue * currentValue;
          break;
        case '/':
          result = currentValue !== 0 ? state.previousValue / currentValue : 0;
          break;
        default:
          return state;
      }

      return {
        display: formatNumber(result),
        previousValue: result,
        operation: input as CalculatorOperation,
        waitingForNewValue: true,
      };
    }

    return {
      ...state,
      operation: input as CalculatorOperation,
    };
  }

  // Number input
  if (state.waitingForNewValue) {
    return {
      ...state,
      display: input,
      waitingForNewValue: false,
    };
  }

  if (state.display === '0') {
    return {
      ...state,
      display: input,
    };
  }

  if (state.display.includes('.') && input === '.') {
    return state;
  }

  return {
    ...state,
    display: state.display + input,
  };
}

export function formatNumber(num: number): string {
  if (Number.isInteger(num)) {
    return num.toString();
  }
  return num.toFixed(10).replace(/\.?0+$/, '');
}


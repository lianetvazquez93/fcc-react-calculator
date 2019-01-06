import React from 'react';
import Buttons from './Buttons';
import Output from './Output';
import Formula from './Formula';
import './App.css';


const isOperator = /[x/+-]/;
const endsWithOperator = /[x/+-]$/;


class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      currentValue: '0',
      previousValue: '0',
      formula: '',
      currentSign: 'pos',
      lastClicked: ''
    };
}

  initialize = () => {
    this.setState({
      currentValue: '0',
      previousValue: '',
      formula: '',
      currentSign: 'pos',
      lastClicked: ''
    });
  }

  digitsLimit = () => {
    this.setState({
      currentValue: 'Digits Limit Met',
      previousValue: this.state.currentValue
    });

    setTimeout(() => 
      this.setState({currentValue: this.state.previousValue}),
    1000);
  }

  handleNumbers = event => {
    if (!this.state.currentValue.includes('Limit')) {
      this.setState({evaluated: false});
      if (this.state.currentValue.length > 19) {
        this.digitsLimit();
      } else if (this.state.evaluated) {
        this.setState({
          currentValue: event.target.value,
          formula: event.target.value != '0'? event.target.value: ''  
        });
      } else {
        this.setState({
          currentValue: this.state.currentValue == '0' ||
                        isOperator.test(this.state.currentValue) ?
                          event.target.value: 
                          this.state.currentValue + event.target.value,
          formula: this.state.currentValue == '0' &&
                   event.target.value == '0' ?
                      this.state.formula: 
                      /([^.0-9]0)$/.test(this.state.formula)?
                        this.state.formula.slice(0, -1) + event.target.value:
                        this.state.formula + event.target.value
        });
      }
    }
  }

  handleDecimal = () => {
    if (this.state.evaluated === true) {
      this.setState({
        currentValue: '0.',
        formula: '0.',
        evaluated: false
      });
    } else if (!this.state.currentValue.includes('.') &&
        !this.state.currentValue.includes('Limit')) {
        this.setState({evaluated: false});
        if (this.state.currentValue.length > 21) {
          this.digitsLimit();
        } else if (endsWithOperator.test(this.state.formula) ||
                  this.state.currentValue == '0' && this.state.formula === '') {
          this.setState({
            currentValue: '0.',
            formula: this.state.formula + '0.'
          });
        } else {
          this.setState({
            currentValue: this.state.formula.match(/(-?\d+\.?\d*)$/)[0] + '.',
            formula: this.state.formula + '.'
          });
        }
    }
  }

  handleOperators = event => {
    if (!this.state.currentValue.includes('Limit')) {
      this.setState({
        currentValue: event.target.value,
        evaluated: false
      });
      if (this.state.formula.includes('=')) {
        this.setState({
          formula: this.state.previousValue + event.target.value
        });
      } else {
        this.setState({
          previousValue: isOperator.test(this.state.currentValue)?
            this.state.previousValue : this.state.formula,
          formula: isOperator.test(this.state.currentValue)?
            this.state.previousValue += event.target.value :
            this.state.formula += event.target.value 
        });
      }
    }
  }

  handleEvaluate = () => {
    if (!this.state.currentValue.includes('Limit')) {
      let expression = this.state.formula;
      if (endsWithOperator.test(expression)) {
        expression = expression.slice(0, -1);
      }
      expression = expression.replace(/x/g, "*").replace(/‑/g, "-");
      let answer = Math.round(1000000000000 * eval(expression)) / 1000000000000;
      this.setState({
        currentValue: answer.toString(),
        formula: expression + '=' + answer,
        previousValue: answer,
        evaluated: true
      }); 
    }
  }

  render() {
    return (
      <div>
        <div className="calculator">
          <Formula formula={this.state.formula} />
          <Output output={this.state.currentValue} />
          <Buttons evaluate={this.handleEvaluate}
                   operators={this.handleOperators}
                   initialize={this.initialize}
                   decimal={this.handleDecimal}
                   numbers={this.handleNumbers} /> 
        </div>
      </div>
    );
  }

}

export default App;

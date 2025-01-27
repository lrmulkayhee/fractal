import FractalGenerator from './components/fractalGenerator.js';

document.addEventListener('DOMContentLoaded', () => {
    const equationInput = document.getElementById('equation-input');
    const generateButton = document.getElementById('generate-button');
    const fractalContainer = document.getElementById('fractal-container');

    generateButton.addEventListener('click', () => {
        let equation = equationInput.value;
        if (equation) {
            // Replace ^ with ** for mathjs
            equation = equation.replace(/\^/g, '**');
            const canvas = document.createElement('canvas');
            const fractalGenerator = new FractalGenerator(canvas);
            fractalGenerator.generate(equation);
            fractalContainer.innerHTML = ''; // Clear previous fractals
            fractalContainer.appendChild(canvas);
        } else {
            alert('Please enter a mathematical equation.');
        }
    });
});
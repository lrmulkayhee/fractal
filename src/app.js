import { derivative, evaluate, complex, abs, exp, pi } from 'mathjs';
import FractalGenerator from './components/FractalGenerator.js';
import renderMathInElement from 'katex/contrib/auto-render';

document.addEventListener('DOMContentLoaded', function () {
    var equationInput = document.getElementById('equation-input');
    var generateButton = document.getElementById('generate-button');
    var zoomInButton = document.getElementById('zoom-in-button');
    var fractalContainer = document.getElementById('fractal-container');
    var submittedEquation = document.getElementById('submitted-equation');
    var equationForm = document.getElementById('equation-form');
    var zoomFactor = 2; // Set initial zoom to 200%

    function generateFractal() {
        var equation = equationInput.value;
        if (equation) {
            // Display the submitted equation in LaTeX style using KaTeX
            submittedEquation.innerHTML = "Submitted Equation: \\(" + equation + "\\)";
            renderMathInElement(submittedEquation, {
                delimiters: [
                    { left: "\\(", right: "\\)", display: false },
                    { left: "\\[", right: "\\]", display: true },
                    { left: "$$", right: "$$", display: true },
                    { left: "$", right: "$", display: false }
                ]
            });

            // Extract n from the equation
            const n = parseInt(equation.match(/\d+/)[0]);

            // Find the roots of the equation
            const roots = findRoots(n);
            console.log('Roots:', roots); // Debugging statement
            const colors = generateColors(roots.length);
            console.log('Colors:', colors); // Debugging statement

            var canvas = document.createElement('canvas');
            var fractalGenerator = new FractalGenerator(canvas);
            fractalContainer.innerHTML = ''; // Clear previous fractals
            fractalContainer.appendChild(canvas);

            // Generate the fractal using Newton's method with the current zoom factor
            fractalGenerator.generateNewton(roots, colors, n, zoomFactor);
        } else {
            alert('Please enter a mathematical equation.');
        }
    }

    function findRoots(n) {
        console.log('Finding roots for equation: z^' + n + ' - 1 = 0'); // Debugging statement

        // Use a numerical solver to find the roots
        const roots = [];
        for (let k = 0; k < n; k++) {
            const theta = (2 * pi * k) / n;
            roots.push(exp(complex(0, theta)));
        }

        console.log('Identified Roots:', roots); // Debugging statement
        return roots;
    }

    function generateColors(numColors) {
        const colors = [];
        for (let i = 0; i < numColors; i++) {
            const hue = i * (360 / numColors);
            const color = hslToRgb(hue, 100, 50);
            colors.push({ r: color[0], g: color[1], b: color[2] });
        }
        console.log('Generated Colors:', colors); // Debugging statement
        return colors;
    }

    function hslToRgb(h, s, l) {
        let r, g, b;
        h /= 360;
        s /= 100;
        l /= 100;
        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    generateButton.addEventListener('click', function (event) {
        event.preventDefault();
        zoomFactor = 2; // Reset zoom factor on new equation
        generateFractal();
    });

    zoomInButton.addEventListener('click', function (event) {
        event.preventDefault();
        zoomFactor *= 1.5; // Zoom in by 50%
        generateFractal();
    });

    equationForm.addEventListener('submit', function (event) {
        event.preventDefault();
        zoomFactor = 2; // Reset zoom factor on new equation
        generateFractal();
    });
});
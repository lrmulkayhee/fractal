import { derivative, evaluate, complex, abs } from 'mathjs';
import FractalGenerator from './components/FractalGenerator.js';
import renderMathInElement from 'katex/contrib/auto-render';

document.addEventListener('DOMContentLoaded', function () {
    var equationInput = document.getElementById('equation-input');
    var generateButton = document.getElementById('generate-button');
    var zoomInButton = document.getElementById('zoom-in-button');
    var fractalContainer = document.getElementById('fractal-container');
    var submittedEquation = document.getElementById('submitted-equation');
    var equationForm = document.getElementById('equation-form');
    var zoomFactor = 1;

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

            // Find the roots of the equation
            const roots = findRoots(equation);
            console.log('Roots:', roots); // Debugging statement
            const colors = generateColors(roots.length);
            console.log('Colors:', colors); // Debugging statement

            var canvas = document.createElement('canvas');
            var fractalGenerator = new FractalGenerator(canvas);
            fractalContainer.innerHTML = ''; // Clear previous fractals
            fractalContainer.appendChild(canvas);

            // Generate the fractal using Newton's method with the current zoom factor
            fractalGenerator.generateNewton(roots, colors, zoomFactor);
        } else {
            alert('Please enter a mathematical equation.');
        }
    }

    function findRoots(equation) {
        console.log('Finding roots for equation:', equation); // Debugging statement

        // Parse the equation and find its derivative
        const f = (z) => evaluate(equation, { z: complex(z.re, z.im) });
        const df = (z) => derivative(equation, 'z').evaluate({ z: complex(z.re, z.im) });

        // Use Newton's method to find the roots
        const roots = [];
        const maxIterations = 100;
        const tolerance = 1e-6;
        const initialGuesses = [
            { re: 1, im: 0 },
            { re: -1, im: 0 },
            { re: 0, im: 1 },
            { re: 0, im: -1 }
        ];

        initialGuesses.forEach(guess => {
            let z = guess;
            for (let i = 0; i < maxIterations; i++) {
                const fz = f(z);
                const dfz = df(z);
                const dz = {
                    re: fz.re / dfz.re,
                    im: fz.im / dfz.im
                };
                z = {
                    re: z.re - dz.re,
                    im: z.im - dz.im
                };
                if (abs(f(z)) < tolerance) {
                    // Check if the root is already in the roots array
                    if (!roots.some(root => abs(complex(root.re - z.re, root.im - z.im)) < tolerance)) {
                        roots.push(z);
                        console.log(`Root found: ${JSON.stringify(z)}`); // Debugging statement
                    }
                    break;
                }
            }
        });

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
        zoomFactor = 1; // Reset zoom factor on new equation
        generateFractal();
    });

    zoomInButton.addEventListener('click', function (event) {
        event.preventDefault();
        zoomFactor *= 1.5; // Zoom in by 50%
        generateFractal();
    });

    equationForm.addEventListener('submit', function (event) {
        event.preventDefault();
        zoomFactor = 1; // Reset zoom factor on new equation
        generateFractal();
    });

    // Call generateFractal initially if there's a default equation
    if (equationInput.value) {
        generateFractal();
    }
});
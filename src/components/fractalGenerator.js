export default class FractalGenerator {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    generateNewton(roots, colors, zoom = 1) {
        const width = this.canvas.width = 800;
        const height = this.canvas.height = 800;
        const maxIterations = 1000;
        const tolerance = 1e-6;
        const imageData = this.ctx.createImageData(width, height);
        const data = imageData.data;

        console.log('Generating fractal with roots:', roots); // Debugging statement
        console.log('Using colors:', colors); // Debugging statement

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let zx = (x - width / 2) / (width / 4) / zoom;
                let zy = (y - height / 2) / (height / 4) / zoom;
                let i = 0;

                while (i < maxIterations) {
                    const zx2 = zx * zx;
                    const zy2 = zy * zy;
                    const denom = 3 * (zx2 + zy2);
                    if (denom === 0) break;

                    const new_zx = (2 * zx + (zx2 - zy2) / denom) / 3;
                    const new_zy = (2 * zy - 2 * zx * zy / denom) / 3;

                    if (Math.abs(new_zx - zx) < tolerance && Math.abs(new_zy - zy) < tolerance) break;

                    zx = new_zx;
                    zy = new_zy;
                    i++;
                }

                // Determine which root the point converges to
                let rootIndex = 0;
                let minDist = Infinity;
                for (let j = 0; j < roots.length; j++) {
                    const dist = Math.sqrt((zx - roots[j].re) ** 2 + (zy - roots[j].im) ** 2);
                    if (dist < minDist) {
                        minDist = dist;
                        rootIndex = j;
                    }
                }

                const p = (x + y * width) * 4;
                const color = colors[rootIndex];
                if (color) {
                    data[p] = color.r; // Red
                    data[p + 1] = color.g; // Green
                    data[p + 2] = color.b; // Blue
                    data[p + 3] = 255; // Alpha
                } else {
                    console.log(`No color found for rootIndex ${rootIndex}`);
                    console.log('Colors array:', colors);
                    console.log('Root index:', rootIndex);
                }
            }
        }

        this.ctx.putImageData(imageData, 0, 0);
        console.log('Fractal generation complete');
    }
}
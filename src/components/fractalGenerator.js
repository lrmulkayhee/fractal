import { evaluate } from 'mathjs';

class FractalGenerator {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 800;
    }

    generate(equation) {
        console.log('Generating fractal for equation:', equation);
        const width = this.canvas.width;
        const height = this.canvas.height;
        const imageData = this.context.createImageData(width, height);
        const data = imageData.data;

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const zx = (x - width / 2) / (width / 4);
                const zy = (y - height / 2) / (height / 4);
                let i = 0;
                let zx2 = zx * zx;
                let zy2 = zy * zy;

                while (zx2 + zy2 < 4 && i < 255) {
                    const temp = zx2 - zy2 + evaluate(equation, { x: zx, y: zy });
                    zy = 2.0 * zx * zy + evaluate(equation, { x: zx, y: zy });
                    zx = temp;
                    zx2 = zx * zx;
                    zy2 = zy * zy;
                    i++;
                }

                const pixelIndex = (x + y * width) * 4;
                data[pixelIndex] = i % 8 * 32;
                data[pixelIndex + 1] = i % 16 * 16;
                data[pixelIndex + 2] = i % 32 * 8;
                data[pixelIndex + 3] = 255; // Alpha
            }
        }

        this.context.putImageData(imageData, 0, 0);
        console.log('Fractal generation complete');
    }
}

export default FractalGenerator;
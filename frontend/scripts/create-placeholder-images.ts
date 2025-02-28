import { writeFileSync } from 'fs';
import { join } from 'path';

// Simple green square
const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA7AAAAOwBeShxvQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABQSURBVFiF7c6xCQAgDETRk2xrZQaxtLCMYGUTBwj+A1k45KO4O6k1bWYXgJzzGmMQEe/4JzOjqnie+L0DAAAAAAAAAAAAAAAAAAAAAPDB7gZ+ETAhZhinhgAAAABJRU5ErkJggg==';

const files = ['icon.png', 'splash.png', 'adaptive-icon.png'];
files.forEach(file => {
  writeFileSync(
    join(__dirname, '..', 'assets', file),
    Buffer.from(base64Image, 'base64')
  );
}); 
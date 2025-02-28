import fs from 'fs';
import path from 'path';

const assetsDir = path.join(__dirname, '..', 'assets');

// Create assets directory if it doesn't exist
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir);
}

// Simple green squares with white borders
const iconData = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA7AAAAOwBeShxvQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABQSURBVFiF7c6xCQAgDETRk2xrZQaxtLCMYGUTBwj+A1k45KO4O6k1bWYXgJzzGmMQEe/4JzOjqnie+L0DAAAAAAAAAAAAAAAAAAAAAPDB7gZ+ETAhZhinhgAAAABJRU5ErkJggg==`;

fs.writeFileSync(path.join(assetsDir, 'icon.png'), Buffer.from(iconData.split(',')[1], 'base64'));
fs.writeFileSync(path.join(assetsDir, 'splash.png'), Buffer.from(iconData.split(',')[1], 'base64'));
fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.png'), Buffer.from(iconData.split(',')[1], 'base64')); 
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const copyDir = (source, destination) => {
  const sourcePath = path.resolve(root, source);
  const destinationPath = path.resolve(root, destination);

  if (!fs.existsSync(sourcePath)) {
    return;
  }

  fs.rmSync(destinationPath, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
  fs.cpSync(sourcePath, destinationPath, { recursive: true });
};

const copyFile = (source, destination) => {
  const sourcePath = path.resolve(root, source);
  const destinationPath = path.resolve(root, destination);

  if (!fs.existsSync(sourcePath)) {
    return;
  }

  fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
  fs.copyFileSync(sourcePath, destinationPath);
};

copyDir('src/assets/images', 'public/img');
copyFile('src/assets/images/icon.png', 'public/icon.png');
copyDir('src/features/case-sites/ai-website-case-01/assets', 'public/ai-website-case-01/assets');
copyDir('src/features/landings/ai-training-lp/assets', 'public/ai-training-lp/assets');
copyFile('src/features/landings/ai-training-lp/styles.css', 'public/ai-training-lp/styles.css');
copyFile('src/features/landings/ai-training-lp/tokens.css', 'public/ai-training-lp/tokens.css');
copyDir('src/features/landings/ryokan-lp/assets', 'public/ryokan-lp/assets');

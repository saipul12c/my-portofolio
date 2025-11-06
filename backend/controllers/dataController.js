import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// ✅ Cara resmi & aman untuk dapat __dirname di ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base path ke folder data
const dataBasePath = path.resolve(__dirname, '..', 'data');

export async function getJsonData(req, res, next) {
  try {
    // The wildcard path is in req.params[0]
    const requestedPath = req.params[0];

    if (!requestedPath) {
      return res.status(400).json({ message: 'Invalid request: No path specified.' });
    }

    // Construct the file path by joining the base path with the requested path
    const filePath = path.join(dataBasePath, `${requestedPath}.json`);
    // Log file yang sedang dibaca
    console.log(`Attempting to read: ${filePath}`);

    const data = await fs.readFile(filePath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`File not found: ${error.path}`);
      res.status(404).json({ message: 'Data not found.' });
    } else {
      // Pass error lain ke handler global
      next(error);
    }
  }
}

export async function addJsonData(req, res, next) {
  try {
    const requestedPath = req.params[0];
    const filePath = path.join(dataBasePath, `${requestedPath}.json`);
    const newData = req.body;

    // Add a unique ID if it doesn't exist
    if (!newData.id) {
      newData.id = Date.now();
    }

    let data = [];
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      data = JSON.parse(fileContent);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }

    data.push(newData);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    res.status(201).json(newData);
  } catch (error) {
    next(error);
  }
}

export async function updateJsonData(req, res, next) {
  try {
    const requestedPath = req.params[0];
    const { id } = req.params;
    const updatedData = req.body;
    const filePath = path.join(dataBasePath, `${requestedPath}.json`);

    const fileContent = await fs.readFile(filePath, 'utf-8');
    let data = JSON.parse(fileContent);

    const itemIndex = data.findIndex(item => String(item.id) === String(id));

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    data[itemIndex] = { ...data[itemIndex], ...updatedData };
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    res.json(data[itemIndex]);
  } catch (error) {
    next(error);
  }
}

export async function deleteJsonData(req, res, next) {
  try {
    const requestedPath = req.params[0];
    const { id } = req.params;
    const filePath = path.join(dataBasePath, `${requestedPath}.json`);

    const fileContent = await fs.readFile(filePath, 'utf-8');
    let data = JSON.parse(fileContent);

    const filteredData = data.filter(item => String(item.id) !== String(id));

    if (data.length === filteredData.length) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    await fs.writeFile(filePath, JSON.stringify(filteredData, null, 2), 'utf-8');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

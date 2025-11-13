import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataBasePath = path.resolve(__dirname, '..', 'data');

export function createController(jsonFileName) {
  const filePath = path.join(dataBasePath, jsonFileName);

  async function readFile() {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return []; // Return empty array if file doesn't exist
      }
      throw error;
    }
  }

  async function writeFile(data) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  return {
    getAll: async (req, res, next) => {
      try {
        const data = await readFile();
        res.json(data);
      } catch (error) {
        next(error);
      }
    },
    getById: async (req, res, next) => {
        try {
          const data = await readFile();
          const item = data.find(item => String(item.id) === String(req.params.id));
          if (item) {
            res.json(item);
          } else {
            res.status(404).json({ message: 'Item not found' });
          }
        } catch (error) {
          next(error);
        }
    },
    create: async (req, res, next) => {
      try {
        const data = await readFile();
        const newItem = {
          id: Date.now(),
          ...req.body
        };
        data.push(newItem);
        await writeFile(data);
        res.status(201).json(newItem);
      } catch (error) {
        next(error);
      }
    },
    update: async (req, res, next) => {
        try {
          const data = await readFile();
          const itemIndex = data.findIndex(item => String(item.id) === String(req.params.id));
          if (itemIndex > -1) {
            data[itemIndex] = { ...data[itemIndex], ...req.body };
            await writeFile(data);
            res.json(data[itemIndex]);
          } else {
            res.status(404).json({ message: 'Item not found' });
          }
        } catch (error) {
          next(error);
        }
    },
    delete: async (req, res, next) => {
        try {
          let data = await readFile();
          const initialLength = data.length;
          data = data.filter(item => String(item.id) !== String(req.params.id));
          if (data.length < initialLength) {
            await writeFile(data);
            res.status(204).send();
          } else {
            res.status(404).json({ message: 'Item not found' });
          }
        } catch (error) {
          next(error);
        }
    }
  };
}

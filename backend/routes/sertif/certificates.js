import express from 'express';
import { createController } from '../../utils/controllerFactory.js';

const router = express.Router();
const controller = createController('sertif/certificates.json');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;

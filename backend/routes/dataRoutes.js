
import express from 'express';
import { createController } from '../utils/controllerFactory.js';
import path from 'path';

const router = express.Router();

const jsonFiles = [
    'galleryData.json',
    'projects.json',
    'about/cards.json',
    'about/certificates.json',
    'about/collaborations.json',
    'about/interests.json',
    'about/profile.json',
    'about/softskills.json',
    'blog/data.json',
    'foto/photos.json',
    'gallery/albums.json',
    'gallery/images.json',
    'gallery/shorts.json',
    'gallery/videos.json',
    'hub/hobbiesData.json',
    'maintenance/maintenanceData.json',
    'sertif/certificates.json',
    'testimoni/testimonials.json'
];

jsonFiles.forEach(file => {
    const routePath = '/' + file.replace('.json', '').replace(/\\/g, '/');
    const controller = createController(file);

    router.get(routePath, controller.getAll);
    router.get(`${routePath}/:id`, controller.getById);
    router.post(routePath, controller.create);
    router.put(`${routePath}/:id`, controller.update);
    router.delete(`${routePath}/:id`, controller.delete);
});

export default router;

const express = require('express');
const crypto = require('crypto');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.post('/deploy', express.raw({ type: 'application/json' }), (req, res) => {
    const sig = req.headers['x-hub-signature-256'];
    const secret = process.env.WEBHOOK_SECRET;

    if (!secret) {
        console.error('❌ WEBHOOK_SECRET no configurado');
        return res.status(500).json({ error: 'Webhook no configurado' });
    }

    if (!sig) {
        return res.status(401).json({ error: 'Firma requerida' });
    }

    const expected = 'sha256=' + crypto.createHmac('sha256', secret).update(req.body).digest('hex');

    if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
        return res.status(401).json({ error: 'Firma inválida' });
    }

    let payload;
    try {
        payload = JSON.parse(req.body.toString());
    } catch {
        return res.status(400).json({ error: 'Payload inválido' });
    }

    if (payload.ref !== 'refs/heads/main') {
        return res.status(200).json({ message: 'Push ignorado (no es main)' });
    }

    res.status(200).json({ message: 'Deploy iniciado' });

    exec('/home/pi/update-fitmeal.sh >> /home/pi/deploy.log 2>&1', (error) => {
        if (error) {
            console.error('❌ Deploy falló:', error.message);
        } else {
            console.log('✅ Deploy completado');
        }
    });
});

// Endpoint para recibir el bundle de deploy directamente desde GitHub Actions
router.post('/deploy-bundle', express.raw({ type: 'application/octet-stream', limit: '150mb' }), (req, res) => {
    const sig = req.headers['x-deploy-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (!secret) return res.status(500).json({ error: 'Webhook no configurado' });
    if (!sig) return res.status(401).json({ error: 'Firma requerida' });

    const expected = 'sha256=' + crypto.createHmac('sha256', secret).update(req.body).digest('hex');
    if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
        return res.status(401).json({ error: 'Firma inválida' });
    }

    const bundlePath = '/tmp/fitmeal-deploy-bundle.tar.gz';
    const projectPath = '/home/pi/projects/fitmeal';

    try {
        fs.writeFileSync(bundlePath, req.body);
    } catch (err) {
        return res.status(500).json({ error: 'Error al guardar el bundle' });
    }

    res.status(200).json({ message: 'Bundle recibido, desplegando...' });

    const deployScript = `
        set -e
        cd ${projectPath}
        tar xzf ${bundlePath}
        docker stop fitmeal-api || true
        docker cp index.js fitmeal-api:/app/
        docker cp routes/. fitmeal-api:/app/routes/
        docker cp controllers/. fitmeal-api:/app/controllers/
        docker cp middleware/. fitmeal-api:/app/middleware/
        docker cp models/. fitmeal-api:/app/models/
        docker start fitmeal-api
        docker compose restart fitmeal-nginx
        echo "✅ Deploy bundle completado"
    `;

    exec(`bash -c '${deployScript.replace(/'/g, "'\\''")}'`, (error, stdout, stderr) => {
        if (error) {
            console.error('❌ Deploy bundle falló:', error.message, stderr);
        } else {
            console.log('✅ Deploy bundle completado:', stdout);
        }
    });
});

module.exports = router;

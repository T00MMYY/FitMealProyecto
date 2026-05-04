const express = require('express');
const crypto = require('crypto');
const { exec } = require('child_process');
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

module.exports = router;

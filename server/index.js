const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Limit increased for base64 images

// Initialize DB
async function initDb() {
    try {
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        await pool.query(schema);
        console.log('Database schema initialized.');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
}

initDb();

// --- BOXES ---

// Get all boxes with their logs
app.get('/api/boxes', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT 
        b.id, b.name, b.species, b.box_type as "boxType", b.install_date as "installDate", 
        b.origin, b.location, b.status, b.photo, b.observations,
        COALESCE(
          json_agg(
            json_build_object(
              'id', ml.id,
              'date', ml.date,
              'type', ml.type,
              'notes', ml.notes,
              'quantity', ml.quantity,
              'photo', ml.photo
            ) ORDER BY ml.date DESC
          ) FILTER (WHERE ml.id IS NOT NULL), 
          '[]'
        ) as "managementHistory"
      FROM boxes b
      LEFT JOIN management_logs ml ON b.id = ml.box_id
      GROUP BY b.id
      ORDER BY b.install_date DESC
    `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Create a box
app.post('/api/boxes', async (req, res) => {
    const { name, species, boxType, installDate, origin, location, status, photo, observations } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO boxes (name, species, box_type, install_date, origin, location, status, photo, observations) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [name, species, boxType, installDate, origin, location, status, photo, observations]
        );
        // Return formatted object to match frontend expectations immediately
        const newBox = result.rows[0];
        res.json({
            id: newBox.id,
            name: newBox.name,
            species: newBox.species,
            boxType: newBox.box_type,
            installDate: newBox.install_date,
            origin: newBox.origin,
            location: newBox.location,
            status: newBox.status,
            photo: newBox.photo,
            observations: newBox.observations,
            managementHistory: []
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Update a box
app.put('/api/boxes/:id', async (req, res) => {
    const { id } = req.params;
    const { name, species, boxType, installDate, origin, location, status, photo, observations } = req.body;
    try {
        const result = await pool.query(
            `UPDATE boxes SET name=$1, species=$2, box_type=$3, install_date=$4, origin=$5, location=$6, status=$7, photo=$8, observations=$9 
       WHERE id=$10 RETURNING *`,
            [name, species, boxType, installDate, origin, location, status, photo, observations, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Box not found' });

        // We need to return the full object with history for the frontend state update to be correct
        // For now, returning simply the updated fields + querying logs or just returning what we updated 
        // expecting frontend to handle, but consistent with GET is better.
        // Simpler here: return mapped fields.
        const updated = result.rows[0];
        res.json({
            id: updated.id,
            name: updated.name,
            species: updated.species,
            boxType: updated.box_type,
            installDate: updated.install_date,
            origin: updated.origin,
            location: updated.location,
            status: updated.status,
            photo: updated.photo,
            observations: updated.observations,
            // history not updated here directly
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Delete a box
app.delete('/api/boxes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM boxes WHERE id=$1', [id]);
        res.json({ message: 'Box deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// --- MANAGEMENT LOGS ---

app.post('/api/boxes/:id/logs', async (req, res) => {
    const { id } = req.params;
    const { date, type, notes, quantity, photo } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO management_logs (box_id, date, type, notes, quantity, photo) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [id, date, type, notes, quantity, photo]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// --- BAITS ---

app.get('/api/baits', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT 
        id, name, type, attractant, location, install_date as "installDate", 
        target_species as "targetSpecies", status, next_inspection_date as "nextInspectionDate", photo
      FROM baits ORDER BY install_date DESC
    `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/baits', async (req, res) => {
    const { name, type, attractant, location, installDate, targetSpecies, status, nextInspectionDate, photo } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO baits (name, type, attractant, location, install_date, target_species, status, next_inspection_date, photo) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [name, type, attractant, location, installDate, targetSpecies, status, nextInspectionDate, photo]
        );
        const newBait = result.rows[0];
        res.json({
            id: newBait.id,
            name: newBait.name,
            type: newBait.type,
            attractant: newBait.attractant,
            location: newBait.location,
            installDate: newBait.install_date,
            targetSpecies: newBait.target_species,
            status: newBait.status,
            nextInspectionDate: newBait.next_inspection_date,
            photo: newBait.photo
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/baits/:id', async (req, res) => {
    const { id } = req.params;
    const { name, type, attractant, location, installDate, targetSpecies, status, nextInspectionDate, photo } = req.body;
    try {
        const result = await pool.query(
            `UPDATE baits SET name=$1, type=$2, attractant=$3, location=$4, install_date=$5, target_species=$6, status=$7, next_inspection_date=$8, photo=$9 
       WHERE id=$10 RETURNING *`,
            [name, type, attractant, location, installDate, targetSpecies, status, nextInspectionDate, photo, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Bait not found' });
        const updated = result.rows[0];
        res.json({
            id: updated.id,
            name: updated.name,
            type: updated.type,
            attractant: updated.attractant,
            location: updated.location,
            installDate: updated.install_date,
            targetSpecies: updated.target_species,
            status: updated.status,
            nextInspectionDate: updated.next_inspection_date,
            photo: updated.photo
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/baits/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM baits WHERE id=$1', [id]);
        res.json({ message: 'Bait deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

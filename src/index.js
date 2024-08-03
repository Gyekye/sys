import express from 'express';
import bodyParser from 'body-parser';
import {Client, Databases, Query} from 'node-appwrite';
import {nanoid} from "nanoid";


const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 3300;


const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setKey('1a258d7f6581b15634ad0b379b3130f32853b29c3eedb3bd09a67ce89420a58a702428033c30cbb955cf59fbd5a08db7b5f59fb923eb42969aec414bb687df30d0b19a2b7d49aa672555303e788e92e334b77e151da6a00ca3c528d8ad2f33e4628374defe2764797797c067573ba81e08dd3b8e100791ed2faa71744111d5f9')
    .setProject('66ad401900321657427c');


const databases = new Databases(client);
const now = new Date();


app.post('/devices', async (req, res) => {
    const {name, userId} = req.body;

    if (!name || !userId) {
        return res.status(400).json({error: 'Missing required fields'});
    }

    try {
        const uid = nanoid(10)
        const response = await databases.createDocument(
            '6678637e001d16c11cc2',
            '66ad4f79000d944dd761',
            uid,
            {
                id: uid,
                name,
                userId,
                active: true,
            }
        );

        console.log(response)
        res.status(201).json(response);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


app.post('/measurements', async (req, res) => {
    const {deviceId, voltage, current, power, energy} = req.body;

    if (!deviceId || !voltage || !current || !power || !energy) {
        return res.status(400).json({error: 'Missing required fields'});
    }

    try {
        const uid = nanoid(10)
        const response = await databases.createDocument(
            '6678637e001d16c11cc2',
            '66ad51b1000bcc3f354a',
            uid,
            {
                id: uid,
                deviceId,
                voltage,
                current,
                power,
                energy,
            }
        );
        res.status(201).json(response);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


app.get('/measurements/:deviceId', async (req, res) => {
    const {deviceId} = req.params;

    if (!deviceId) {
        return res.status(400).json({error: 'Device ID is required'});
    }

    try {
        const response = await databases.listDocuments(
            '6678637e001d16c11cc2',
            '66ad51b1000bcc3f354a',
            [Query.equal('deviceId', deviceId)]
        );
        res.status(200).json(response.documents);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

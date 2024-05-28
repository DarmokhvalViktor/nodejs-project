import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { Registration } from '../model/Registration';
import {
    createRegistration,
    getRegistrations,
    registrationCounts
} from '../controller/RegistrationController';
import axios from "axios";

jest.mock('axios');

const app = express();

app.use(bodyParser.json());

app.post('/api/registration', createRegistration);

describe('Integration Tests', () => {
    it('POST /api/registration - should return 400 if missing required fields', async () => {
        const response = await request(app)
            .post('/api/registration')
            .send({ description: 'Car #31', price: 24213 });

        expect(response.status).toBe(400);
        expect(response.body.msg).toBe('Car ID, description, and a valid positive price are required');
    });

    it('POST /api/registration - should return 400 if car does not exist', async () => {
        const mockReqBody = {
            carId: 8,
            description: 'Car #31',
            price: 24213
        };

        // Mock checkCarExists to return false (car does not exist)
        (axios.get as jest.MockedFunction<typeof axios.get>).mockRejectedValue({ response: { status: 404 } });

        const response = await request(app)
            .post('/api/registration')
            .send(mockReqBody);

        expect(response.status).toBe(400);
        expect(response.body.msg).toBe('Car does not exist');
    });
});

app.get('/api/registration', getRegistrations);
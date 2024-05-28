import {Request, Response} from 'express';
import {Registration, IRegistration} from "../model/Registration";
import axios from 'axios';

const checkCarExists = async (carId: number): Promise<boolean> => {
    try {
        const response = await axios.get(`http://backend-app:8080/api/cars/${carId}`);
        return response.status === 200;
    } catch (error) {
        console.error('Error connecting to Java service:', error);
        return false;
    }
};

export const createRegistration = async (req: Request, res: Response) => {
    const { carId, description, price } = req.body;

    if (!carId || !description || price === undefined || price === null || price < 0) {
        return res.status(400).json({ msg: 'Car ID, description, and a valid positive price are required' });
    }

    try {
        const carExists = await checkCarExists(carId);
        if (!carExists) {
            return res.status(400).json({ msg: 'Car does not exist' });
        }

        const registration = new Registration({ carId, description, price });
        await registration.save();

        res.status(201).json({ msg: 'Registration created successfully', registration });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};

export const getRegistrations = async (req: Request, res: Response) => {
    console.log('Get request', req.query);
    const { carId, size, from } = req.query;

    try {
        const registrations = await Registration.find({ carId })
            .sort({ date: -1 })
            .skip(Number(from) || 0)
            .limit(Number(size) || 0);
        res.json(registrations);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};

export const registrationCounts = async (req: Request, res: Response) => {
    const { carIds } = req.body;
    try {
        const counts = await Registration.aggregate([
            { $match: { carId: { $in: carIds.map((id: string) => parseInt(id)) } } },
            { $group: { _id: '$carId', count: { $sum: 1 } } }
        ]);

        const result: Record<string, number> = {};

        counts.forEach((c: any) => {
            result[`id${c._id}`] = c.count;
        });

        carIds.forEach((id: any) => {
            if (!result.hasOwnProperty(`id${id}`)) {
                result[`id${id}`] = 0;
            }
        });

        res.json(result);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};
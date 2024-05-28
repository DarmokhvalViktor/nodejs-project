import { Schema, model, Document } from 'mongoose';

export interface IRegistration extends Document {
    carId: number;
    date: Date;
    description: string;
    price: number;
}

const RegistrationSchema = new Schema({
    carId: {type: Number, required: true },
    date: {type: Date, default: Date.now},
    description: {type: String, required: true},
    price: {
        type: Number,
        required: true,
        min: 0,
        max: 999999,
        validate: {
            validator: (value: number) => Number.isInteger(value),
            message: '{VALUE} is not an integer value for price'
        }
    }
});
RegistrationSchema.set('autoIndex', false);

export const Registration = model<IRegistration>('Registration', RegistrationSchema);
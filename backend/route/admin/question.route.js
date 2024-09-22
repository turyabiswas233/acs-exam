import express from 'express'
import { Question } from '../../model/exam.model.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const data = req.body;

    try {
        const question = new Question(data)
        await question.save();
        res.status(200).send({ status: true, data: await Question.find({ examname: data?.examname }), message: "Successfully uploaded questions" })
    } catch (error) {
        res.status(404).send({ status: false, message: 'Failed to upload question' })
    }
})
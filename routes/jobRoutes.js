const express = require('express');
const router = express.Router();
const Job = require('../models/jobModels');

// Route 1: GET all job postings for the public careers page
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ postedAt: -1 });
    // Directly send the array of jobs
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ success: false, message: 'Server error fetching jobs.' });
  }
});

// Route 2: POST a new job posting for the admin page
router.post('/admin/jobs', async (req, res) => {
  try {
    // Creating a new Job instance directly from the request body.
    const newJob = new Job(req.body);
    
    // Save the new job to the database
    await newJob.save();
    
    // Send a successful response with the created job's data
    res.status(201).json({ success: true, message: 'Job created successfully!', data: newJob });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(400).json({ success: false, message: 'Failed to create job.', error: error.message });
  }
});

// Route 3: PATCH (update) an existing job posting for the admin page
router.patch('/admin/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedJob = await Job.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!updatedJob) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    res.status(200).json({ success: true, message: 'Job updated successfully!', data: updatedJob });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(400).json({ success: false, message: 'Failed to update job.', error: error.message });
  }
});

// Route 4: DELETE a job posting
router.delete('/admin/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedJob = await Job.findByIdAndDelete(id);

    if (!deletedJob) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    res.status(200).json({ success: true, message: 'Job deleted successfully!' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ success: false, message: 'Server error deleting job.' });
  }
});

module.exports = router;

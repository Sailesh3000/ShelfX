import express from 'express';
import { SessionsClient } from '@google-cloud/dialogflow';

const router = express.Router();

router.post('/dialogflow', async (req, res) => {
  const sessionClient = new SessionsClient();

  const sessionId = req.body.sessionId || 'default-session';
  
  const sessionPath = sessionClient.projectAgentSessionPath(
    process.env.DIALOGFLOW_PROJECT_ID,
    sessionId
  );

  try {
    const responses = await sessionClient.detectIntent({
      session: sessionPath,
      queryInput: req.body.queryInput,
    });
    
    res.status(200).json(responses[0].queryResult);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error processing request' });
  }
});

export default router;
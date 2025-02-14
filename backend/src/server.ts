import express from 'express';
import cors from 'cors';
import teacherRouter from './routes/teacherRoutes';
import prisma from './prisma';

const app = express();
app.use(cors());
app.use(express.json());

(async () => {
  try {
    await prisma.$connect();
    console.log('Connected to the database successfully.');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
})();


app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

app.use('/api/teacher', teacherRouter);


// Global error handling 
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});


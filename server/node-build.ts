import { createServer } from './index';

const app = createServer();
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`🚀 Production server running on port ${port}`);
});

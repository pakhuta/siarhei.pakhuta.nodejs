import app from './app';
import Output from './utils/output';

const port = process.env.PORT;
app.listen(port, () => Output.write(`App listening on port ${port}!`));

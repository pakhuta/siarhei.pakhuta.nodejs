import app from './app';
import Output from './utils/output';

const port = process.env.PORT || 8080;
app.listen(port, () => Output.write(`App listening on port ${port}!`));

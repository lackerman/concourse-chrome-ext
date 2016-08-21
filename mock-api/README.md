# Mock Concourse API

Used for simulating the data from the Concourse API.

The Mock API is built using [NodeJS](https://nodejs.org/en/download/) and requires NPM.

Running the Mock API

1. Open the terminal and `cd` into the mock-api folder
2. Run `npm install` to install the required dependencies (express)
3. Start the server `npm start` and look for `Server started on port 8080`

### Testing that it works

1. Right click on the **Concourse: Selected Pipelines** icon in Chrome, and select **Options**
2. Enter `http://localhost:8080/api/v1/pipelines` into the the first textbox which reads **Paste the URL of your Concourse server**
3. Click **Query Concourse Server**
4. Select the pipelines you want to monitor (for demo purposes select at least the **broken-pipeline**)
5. Click **Save Selection**
6. Wait about 60seconds for the notification
7. Click the notification once it appears.

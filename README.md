# Concourse Pipeline Status Tracker Chrome Extension

A little project for us to track the status of our pipelines.

## Local Development

1. Start by cloning the repository.
2. Go to https://developer.chrome.com/extensions/getstarted#unpacked and follow the steps to load an *unpacked* extension.
3. Test that it works
   - The simplist way to test is to simulate the Concourse API (See below).

### Setup Static site

Setup a static site to serve the json files from the `test-data` directory.

One option is to use `static-server` npm module (requirement [NodeJS](https://nodejs.org/en/download/))

```
npm install -g static-server
```

`cd` into the `test-data` directory and run `static-server .` and open your browser at [http://localhost:9080](http://localhost:9080).

## How to Contribute

Feel free to fork the project and submit a pull-request or create an issue on the repository's [issue tracker](https://github.com/lackerman/concourse-chrome-ext/issues)

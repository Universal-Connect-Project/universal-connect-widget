# Quick How-to

If you haven't had a chance yet, please refer to [ucp-example repo](https://github.com/Universal-Connect-Project/ucw-example) 
for direction on how to use this repo within the larger ecosystem of the Universal Connect Project.

### The Widget

You can use docker, or run the code from the command-line directly.

#### Option 1:
Build and run the docker image.

```
./build.sh
./start-docker.sh
```

#### Option 2:
Run the code directly from the command-line:

```
npm ci
```
Followed by:
```
npm run dev
```
to serve the widget at `http://localhost:3000`

This service can now be used by the `ucw-app` app.

## List of banks to test with 
- Sophtron: Sophtron Bank
- MX: MX Bank
- Finicity: Finbank
- Akoya: mikomo

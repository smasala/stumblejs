## Stumble JS

JavaScript error logger and monitor. 

All JavaScript errors are caught and sent via ajax to be logged on the server.

## Getting Started

Insert the following tags. Make sure they are placed before any other JS runs.

    <link rel="manifest" href="manifest.json" />
	<script src="bower_components/stumblejs/dist/stumble.js"></script>

## Manifest Configuration

    {
        "stumblejs": {
            "url": "myserver/error"
        }
    } 
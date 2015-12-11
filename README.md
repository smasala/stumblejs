## Stumble JS

JavaScript error logger. Monitor all JavaScript errors and send them via ajax to be recorded on a server side log

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
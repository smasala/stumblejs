## Stumble JS

JavaScript error logger and monitor. 

All JavaScript errors are caught and sent via ajax to be logged on the server.

## Getting Started

### Installation
#### Bower
    bower install stumbejs
#### NPM
	npm install stumblejs

### Finally
Insert the following tags. Make sure they are placed before any other JS runs.

    <link rel="manifest" type="application/manifest+json" href="manifest.json" />
	<script src="bower_components/stumblejs/dist/stumble.js"></script>

## Manifest Configuration

    {
        "stumblejs": {
            "url": "myserver/error"
            ...
        }
    } 
    
* `url`: server address to send error messages
* `batchTimer`: how often (ms) you wish to send a batch of errors [default=200]
    
## Contributions

Please use the development environment when contributing to this project ``npm install && grunt dev``. Thank you.
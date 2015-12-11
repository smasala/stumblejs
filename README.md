## Stumble JS

JavaScript error logger and monitor. 

All JavaScript errors are caught and sent via ajax (batch-wise) so that they can be logged server-side

## Getting Started

### Installation
#### Bower
    bower install stumbejs
#### NPM
	npm install stumblejs

### Finally
Insert the following tags. Place the following tags before any JavaScript is executed.

    <link rel="manifest" type="application/manifest+json" href="manifest.json" />
	<script src="bower_components/stumblejs/dist/stumble.js"></script>

## Manifest Configuration

    {
        "stumblejs": {
            "url": "myserver/error"
            ...
        }
    } 
    
* `url`: string, server address to send error messages
* `batchTimer`: integer [default=200], how often (ms) you wish to send a batch of errors 
* `silent`: boolean [default=false], sent true to prevent console.error logs
    
## Contributions

Please use the development environment when contributing to this project ``npm install && grunt dev``. Thank you.
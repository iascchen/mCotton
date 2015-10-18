# mCotton Restful API

## Message of Data and Control

### Fetch Batch Data Upload SessionID

    :version/sid

	method: GET
	authRequired: false

Batch Data Upload SessionID is timestamp of server, used for batch data upload

Used by: MyCity

### Upload Data Message

    :version/d

	method: POST
	authRequired: false

Data Message is upload by client, its format is looks like:

	Headers:
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(jsonObject, 'utf8')
    
    Post Bodys:
    
    	{
    	  "device_id": "TcWLAo99MRtxNYKRk",
    	  "key1":"value1",
    	  "key2":"value2"
    	}

### Upload Control Event

    :version/c

	method: POST
	authRequired: false

Control Message is upload by client, its format is looks like:

	Headers:
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(jsonObject, 'utf8')
    
    Post Bodys:
    
    	{
    	  "device_id": "TcWLAo99MRtxNYKRk",
    	  "key1":"value1"
    	}

###  Get Latest Control Event in 2 minutes

    :version/ce/:device_id
    
	method: GET
	authRequired: false

### Get Latest Data Event in 2 minutes 

    :version/de/:device_id

	method: GET
	authRequired: false

## Projects and Devices

### Get Projects

    :version/projects
    
	method: GET
	authRequired: false

### Create My Device

    :version/mydevices
    
	method: PUT
	authRequired: true

### Get My Devices
    
    :version/mydevices

	method: GET
	authRequired: true

### Get Open Device

    :version/opendevices
    
	method: GET
	authRequired: true
	
## Data Visualizatoin
    
##@ Get Line Data Chart

    :version/vis/:device_id/:period
    
    method: GET
    authRequired: true

## Get MyCity Graphic Data

    :version/vis_city/:device_id

    method: GET
    authRequired: true

## Get MyCity Line Data Chart

    :version/de_city/:device_id

    method: GET
    authRequired: true
    
# SmartConfig

## SmartConfig For test Client Ip Address
 
### Test Client IP

    :version/clientIp

    method: GET
    authRequired: false
    
    Headers:
       
        'x-forwarded-for': 'ip',

## SmartConfig For Arduino device

### Reg Device to Server for generate Device ID

    :version/regDevId

    method: POST
    authRequired: false
    
    Headers:
            'x-forwarded-for': 'ip',
           
### Reg Device to Server for generate Device ID

    :version/regDevId

    method: POST
    authRequired: false
        
    Headers:
        'x-forwarded-for': 'ip',
                
## SmartConfig For Mobile APP

### Wait Server Gen Device ID
    
    :version/waitDevId

    method: POST
    authRequired: false
# mCotton MQTT Message

## Message of Data and Control

### Upload Data Message

    :version/d/:user_id/:device_id
    
    Message Body
    
        {
            "device_id": "TcWLAo99MRtxNYKRk",
        	"key1":"value1",
        	"key2":"value2"
        }

### Upload Control Event

    :version/c/:user_id/:device_id
    
    Message Body
        
        {
            "device_id": "TcWLAo99MRtxNYKRk",
            "key1":"value1"
        }
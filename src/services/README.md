# Tradeoffs and Scope of Each Service

### 1. Vector DB

#### Moving with QdrantDB

- Cloud based
- Easy to set up
- Free-tier
- Provide additional information storage capability (Payload-JSON Data)

#### Alternates

- Set up locally any available vectorDB
- MongoDB Atlas(a document db with vector search feature)
- Pipecone (free)

#### Data Modeling
- Data to be stored in QdrantDB as `Point`(related to Qdrant) following the predefined structure.  

**Point Structure** 
```JSON
{
    "id": "<UUID>",
    "vector": [...],
    "payload": {
        "video_id": "<UUID>",
        "text": "Original text from the transcript.",
        "start_time": 101.2,
        "end_time": 115.6,
    }
}
```
- Have to define a `Collection` to group those `Points` related to same video's transcript.  
- Along with that we'll have to define the `CollectionID` for points belonging to same video. Possible approaches are:  
    1.  We can generate a UUID for every new video upload as our `CollectionID`.
    2. Or since we're using `Multer` for file uploads which generate a unique ID for each file(video) upload, thus we can use that as `CollectionID`. And for youtube video we go with the `query-params` of the video URL as  the `CollectionID`.


# Tradeoffs and Scope of Each Service

## 1. Vector DB

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
  2.  Or since we're using `Multer` for file uploads which generate a unique ID for each file(video) upload, thus we can use that as `CollectionID`. And for youtube video we go with the `query-params` of the video URL as the `CollectionID`.

## 2. Transcription Service

- Automatic Speech Recognition(ASR) transcribes a given audio into text
- Tried using hugging-face `Inference Provider` enabling models to be serverless and serves the HTTP request (via client sdk or fetch api).
- The inference provider has a limit over free use(reduces the development and testing time)
- Going with the huggingface's `transformers.js` package (same as it's equivalent python library).

### Limitation with NodeJs enviroment:

- There is no support of stream based solution for ASR task with hugging face `transformers.js` `pipleine`
- The current solutions present out there which supports streaming based ASR compromises on the accuracy for latency.
- Our task / MVP requires accuracy over latency thus went with the applied approach

## 3. Embedding service

- Face the same limitation of huggingface's cloud based solution of `Inference Provider` as with the transcription service.
- Going with the local solution of `pipeline` provided in `transformers.js`.

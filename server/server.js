const fs = require('fs');
var express = require('express');
var app = express();
var cors = require('cors');

var filename = 'data/Normal1.zip'

app.use(cors());

app.get('/filelength', function(req, res){
    console.log('request trigger filelength');
    fs.readFile(filename, function(err,data){
        if(!err) res.send({len: data.length});
        else res.status(500).send({err});
    });
});

app.get('/downloadnormal', function(req, res){
    console.log('request trigger file download');
    fs.readFile(filename, function(err,data){
        if(!err) res.end(data);
    });
});

app.get('/:start/:end/:retry', function(req, res){
    console.log('request trigger start:%s stop:%s', req.params.start, req.params.end);
    var startChunkIndex = parseInt(req.params.start);
    var endChunkIndex = parseInt(req.params.end);
    var retry = parseInt(req.params.retry);
    var tempFilename = filename;

    // if (startChunkIndex<1024*1024 && retry == 4){
    //     tempFilename = filename + '1';
    // }
    console.log(startChunkIndex, retry);
    console.log(tempFilename);
    fs.createReadStream(tempFilename, {start:startChunkIndex, end:endChunkIndex})
        .on('error',(err)=>{
            //throw new Error('bullshit');
            console.log(err);
            res.status(500).send({error:'Something happens'});
        })
        .pipe(res);
});

var server = app.listen(1234, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
 });
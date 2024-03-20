var http=require('http');  //노드모듈을 가져오기
var hostname='127.0.0.1'  //내 컴퓨터 내부주소
var port="8080" //사용할 서버 포토 번호

//   서버생성(request: 요청, responsive: 응답)
const server=http.createServer(function(req, res){
    const path=req.url;
    const method=req.method;
    if(path==='/products'){
        if(method==='GET'){
            res.writeHead(200,{"Content-Type":"application/json"});
            const products=JSON.stringify([
                {
                    name:"강아지 물병", 
                    price:6000,
                    
                },
            ]);
            res.end(products)
        }else if(method==='POST'){
            res.end("생성되었습니다.")

        }
        
    }
    res.end("bye bye")
})
server.listen(port, hostname);
console.log('server 성공')
const socket=io.connect("http://localhost:3000");
const sender=document.getElementById("sender");
const message=document.getElementById("message");
const btn=document.getElementById("submit");
const output=document.getElementById("output");
const feedback=document.getElementById("feedback");

btn.addEventListener("click",()=>{
    socket.emit("chat",{
        sender:sender.value,
        message:message.value
    });
}
);
socket.on("chat",(data)=>{
    output.innerHTML+='<p><strong>'+data.sender+':</strong>'+data.message+'</p>';
    feedback.innerHTML="";
    message.value="";
}
);
message.addEventListener("keypress",()=>{
    socket.emit("typing",sender.value);
}
);
socket.on("typing",(data)=>{
    feedback.innerHTML='<p><em>'+data+' is typing a message...</em></p>';
}
);


// Alist comments function

async function commentsMain() {
    // 获取body对象
    while (true) {
        objBoxElement = document.querySelector(".title");
        if (objBoxElement) {
            break;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    commentsLayout();
    getComments();
}

function commentsLayout() {
    bodyElement = document.querySelector(".body");
    // 创建评论区布局
    commentBox = document.createElement("div");
    commentBox.className += "comBox  hope-c-PJLV-ikSuVsl-css"

    // 创建评论区标题
    commentTitle = document.createElement("h3");
    commentTitle.innerHTML = "Comment";
    commentTitle.className += "comTitle";

    // 创建发送评论布局
    commentSendBox = document.createElement("div");
    // 输入框布局
    sendInputBox = document.createElement("div");
    sendInputBox.className = "hope-c-mWwdD hope-c-mWwdD-PJLV-scrollBehavior-outside hope-c-PJLV-ijhzIfm-css"
    sendInput = document.createElement("textarea");
    sendInput.ariaLabel = "input-text";
    sendInput.rows = "4";
    sendInput.className += "comTextInput hope-c-PJLV hope-c-kvTTWD-hYRNAb-variant-filled hope-c-kvTTWD-gfwxhr-size-md hope-c-PJLV-hbsPHc-cv hope-c-PJLV-ibtHApG-css";
    sendInputBox.appendChild(sendInput);
    // 功能按钮布局
    sendButtonBox = document.createElement("div");
    sendButtonBox.className += "comButtonBox hope-c-PJLV-ilofsCn-css";
    sendButton = document.createElement("button");
    sendButton.innerHTML = "发送";
    sendButton.type = "button";
    sendButton.onclick = sendComment;
    sendButton.className += "comButton hope-c-ivMHWx-kcPQpq-variant-subtle hope-c-ivMHWx-dvmlqS-cv hope-c-PJLV-iikaotv-css";
    sendButtonBox.appendChild(sendButton);
    
    // 添加发送布局
    commentSendBox.appendChild(sendInputBox);
    commentSendBox.appendChild(sendButtonBox);

    // 创建评论列表
    commentList = document.createElement("div");
    commentList.className += "comment-list hope-stack hope-c-dhzjXW hope-c-PJLV hope-c-PJLV-ihXHbZX-css";

    // 添加评论区布局
    commentBox.appendChild(commentTitle);
    commentBox.appendChild(commentSendBox);
    commentBox.appendChild(commentList);

    bodyElement.appendChild(commentBox);
}

function sendComment() {
    let sendContent = document.querySelector(".comTextInput").value;
    if (sendContent == "") {
        console.warn("Input content is empty");
        alert("Input content is empty");
        return;
    }
    console.log(sendContent);
    // 向服务器发送评论文字
    fetch("/comments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "content": sendContent
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if(data.status == 0) {
            alert("Send success");
            // 刷新页面
            location.reload();
        }
        else if(data.status == 3) {
            alert("Forbidden");
        }
   })
}

// 拉取数据并显示
function getComments() {
    const queryParams = {
        skip: 0,
        length: 10
    };
    const url = `/comments?${new URLSearchParams(queryParams)}`;
    // 向服务器请求评论数据
    fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // 显示评论
        showComment(data.data);
    })
}

function showComment(comments) {
    // 倒序显示
    comments.reverse();
    for (let comment of comments) {
        let commentBox = document.querySelector(".comment-list");
        let comLayout = createComment(comment);
        commentBox.appendChild(comLayout);
    }
}

// 创建单个评论内容布局
function createComment(comment) {
    var div = document.createElement('div'); 
    div.className = 'comment-item hope-stack hope-c-dhzjXW';
    let content =`
        <div class="mes_info">
            <p class="user_name">${comment["name"]}</p>
            <p class="mes_time">${comment["time"]}</p>
        </div>
        <div class="cont">
            <p>${comment["content"]}</p>
        </div>
        `
    div.innerHTML = content;
    return div;
}

window.onload = function () {
    commentsMain();
}
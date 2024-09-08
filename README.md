### 为Alist添加一个简单的留言评论功能 

#### 环境 

1. Python and Flask: Python 和 Flask 处理请求 

2. Nginx: 请求转发 

3. Sqlite3: 管理数据 

4. Alist: 在 Alist 上添加的当然需要

#### 配置 

1. 配置 Nginx 路径转发 /static 和 /comments 

2. 运行 Python 脚本 

3. 修改 Alist 全局配置 

   - 自定义头部 `<link rel="stylesheet" href="/static/css/commentsStyle.css">` 

   - 自定义内容 `<script src="/static/js/commentsLoad.js"></script>` 


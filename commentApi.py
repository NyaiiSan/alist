import os
import sqlite3

from flask import Flask, jsonify, request, session

SQLITE_PATH = "database.db"

app = Flask(__name__)
app.secret_key = os.urandom(32)

@app.route('/comments', methods=['GET', 'POST'])
def comment_api():

    user_ip = request.headers.get('X-Forwarded-For', None)
    if not user_ip:
        user_ip = request.remote_addr
    response = {
        'status': None,
        'data': None
    }

    # POST 请求发送评论
    if request.method == 'POST':
        if 'user_ip' not in session:
            response['status'] = 3
            return jsonify(response), 403

        raw_data = request.get_json()
        comment_content = raw_data.get('content')
        # 验证留言合法性
        if comment_content == '' or len(comment_content) > 400:
            response['status'] = 4
            return jsonify(response)

        # 创建留言
        name = hide_ip(user_ip)
        # 将留言写入到数据库中
        with sqlite3.connect(SQLITE_PATH) as conn:
            c = conn.cursor()
            c.execute("SELECT max(ID) FROM comments;")
            last_mes_id = c.fetchone()
            mes_id = last_mes_id[0] + 1 if last_mes_id[0] != None else 0
            c.execute("INSERT INTO comments(ID, name, content, IP, time) VALUES (?, ?, ?, ?, datetime('now','localtime'))", 
                      (mes_id, name, comment_content, user_ip))

            response['status'] = 0
            return jsonify(response)

    # GET 请求拉取评论
    if request.method == 'GET':

        skip = request.args.get('skip')
        length = request.args.get('length')
        if skip == None or length == None:
            response['status'] = 1
            return response

        session["user_ip"] = hide_ip(user_ip)
        comments = []
        with sqlite3.connect(SQLITE_PATH) as conn:
            c = conn.cursor()
            for m in c.execute("SELECT content, name, time from comments"):
                comments.append({
                    'content': string_replace(m[0]),
                    'name': m[1],
                    'time': m[2]
                })
        response['status'] = 0
        response['data'] = comments

        return jsonify(response)

def init_database():
    sqlite_cmd = '''
    CREATE TABLE IF NOT EXISTS comments(
        ID      INT PRIMARY KEY NOT NULL,
        NAME    TEXT NOT NULL,
        content TEXT NOT NULL,
        IP      TEXT NOT NULL,
        TIME    TEXT);
        '''
    with sqlite3.connect(SQLITE_PATH) as conn:
        c = conn.cursor()
        try:
            c.execute(sqlite_cmd)
            for s in c.execute('SELECT count(*) FROM comments;'):
                print('共有%s条记录.'%s[0])
        except Exception as e:
            print(e)

def hide_ip(ip:str) -> str:
    '''将ip地址部分隐藏'''
    res = ip.split(':') if ':' in ip else ip.split('.')
    res[1] = " * "
    res[2] = " * "
    res = ":".join(res) if ':' in ip else ".".join(res)
    return res

def string_replace(string:str) -> str:
    string = string.replace('<', '&lt;')
    string = string.replace('>', '&gt;')
    string = string.replace('&', '&amp;')
    string = string.replace('"', '&quot;')
    string = string.replace("'", '&apos;')
    string = string.replace('\n', '<br>')

    return string

if __name__ == '__main__':
    init_database()
    app.run(host='127.0.0.1', port=4000)
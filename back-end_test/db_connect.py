# db 접속 테스트
import pymysql
# sqlAlchemy아니다. mysql이랑 이어주는 라이브러리만 사용한 연결테스트임.
def dbconnect():
    # 응 root는 로그인 안돼. 계정 새로 만들어야 했다...
    conn = pymysql.connect(host='127.0.0.1', user='root', password='1234', db='test', charset='utf8')
    return conn

def insert_data(conn, table):
    cur = conn.cursor()
    
    # name = input("삭제할 사용자 이름 : ")
    # cur.execute(f"select user_id from {table} where name = '{name}'")
    # u_id = cur.fetchone()
    # sql = f"delete from {table} where user_id = '{u_id}"
    # cur.execute(sql)
    conn.commit()

def main():
    conn = dbconnect()
    print('connected')
    insert_data(conn, 'user_info')
    conn.close()
    print("disconnect")


if __name__ == "__main__":
    main()




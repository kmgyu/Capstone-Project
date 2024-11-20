from openai import OpenAI
import json
from datetime import datetime
import dotenv
import os

# # OpenAI API 키 설정
# openai.api_key = 
dotenv.load_dotenv()
API_KEY=os.environ.get('API_KEY')

# 사용자로부터 받은 데이터 예시
user_data = {
    "country": "대한민국",
    "region": "경기도",
    "crop": "배추",
    "month": 11,
    "day": 12,
    "weather": {
        "wind_speed": "5m/s",
        "sky_condition": "흐림",
        "precipitation": {
            "is_raining": True,
            "amount": "10mm"
        }
    }
}

# 모델에 보낼 프롬프트 생성 함수
def generate_prompt(data):
    return f"""저는 {data['country']}의 {data['region']}에서 농사하고 있습니다. {data['crop']}을 기르고 있으며, 오늘은 {data['month']}월 {data['day']}일입니다. 
    금일 날씨는 {data['weather']['wind_speed']}의 풍속, {data['weather']['sky_condition']} 하늘 상태이며, 강수 여부는 {data['weather']['precipitation']['is_raining']} (강수량: {data['weather']['precipitation']['amount']}) 입니다. 
    이 조건에 맞는 적합한 농사 작업을 추천해 주세요."""

# OpenAI API 호출 함수
def get_farming_recommendation(data):
    # 모델에 전달할 프롬프트 생성
    prompt = generate_prompt(data)
    
    client = OpenAI(
        api_key=API_KEY
    )
    
    # ChatCompletion 형식으로 요청을 전송합니다.
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",  # 또는 "gpt-4" 모델을 사용할 수 있습니다.
        messages=[
            {"role": "system", "content": "You are an agricultural assistant."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=100,
        temperature=0.7,
        
    )
    
    # 응답 텍스트 가져오기
    recommendation_text = response.choices[0].message.content.strip()
    
    # 추천 결과를 JSON 형식으로 변환
    # 모델 응답을 특정 포맷으로 파싱합니다. (가정된 형식)
    result = {
        "작업 이름": "예시 작업 이름",
        "작업 내용": recommendation_text,
        "시작일": f"{data['month']}월 {data['day']}일",
        "기간": "3일",  # 기간은 모델에서 직접 추천을 받을 수도 있습니다.
        "주기 단위": "7일"
    }
    
    return result

# 실행
if __name__ == "__main__":
    recommendation = get_farming_recommendation(user_data)
    
    # JSON 형식으로 변환하여 출력
    print(json.dumps(recommendation, ensure_ascii=False, indent=4))

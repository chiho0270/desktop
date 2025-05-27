import google.generativeai as genai
import os 

GEMINI_API_KEY = "AIzaSyBABSX9mx-EBIBmGH3fRfegdsJolM1Pscc"
# 실제로 프로젝트에서는 .env파일에 따로 key를 저장해서 사용 중인데 실습용이라 보안
# 신경 안쓰고 그냥 이렇게 쓸려는거임 ㅇㅇ
genai.configure(api_key=GEMINI_API_KEY)

MODEL_TO_USE = 'models/gemini-2.0-flash-lite-001'
#아까 위에서 설명한 모델을 여기다가 넣으면 됨 생각보다 모델 불러오기 쉬움 ㅋ

try:
    model = genai.GenerativeModel(MODEL_TO_USE)
    print(f"'{MODEL_TO_USE}' 모델 로딩 성공 ")
except Exception as e:
    print(f"오류: 모델 로딩 실패 . 모델 이름 '{MODEL_TO_USE}'을 확인해 주세요.")
    print(f"오류 내용: {e}")
    exit() #갑자기 실행 꺼지면 모델 명 잘못된거임 확인 ㄱㄱ

question_for_gemini = "안녕하세요"

print(f"\n내가 Gemini에게 물어볼 질문: '{question_for_gemini}'")
print("Gemini가 답변할 때까지 기다리는 중...")

try:
    gemini_response = model.generate_content(question_for_gemini)


    answer_text = gemini_response.text

    print("\n--- Gemini의 답변 ---")
    print(answer_text)
    print("--------------------")

except Exception as e:
    print(f"\n오류: Gemini API 호출 중 문제가 발생했습니다.")
    print(f"오류 내용: {e}")
    print("API 키가 올바른지, 네트워크 연결 상태는 괜찮은지 확인해 보세요.")

def ask_gemini(question):
    try:
        gemini_response = model.generate_content(question)
        return gemini_response.text
    except Exception as e:
        return f"Gemini API 오류: {e}"
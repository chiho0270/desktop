import gradio as gr

custom_css = """
/* 전체 컨테이너 설정 */
.gradio-container { 
    height: 100vh !important; 
    max-width: 100% !important;
}
/* 상단 여백 줄이기 */
.main { padding-top: 0 !important; }
h3 { margin-top: 0 !important; margin-bottom: 5px !important; }

/* 채팅창 크기 확장 - 계산식으로 최대 공간 활용 */
#chatbot { 
    flex-grow: 1 !important; 
    height: calc(100vh - 112px - 16px) !important; 
    min-height: 600px !important;
    overflow: auto !important;
}
/* 푸터 제거 */
footer {display: none !important;}
"""

# 챗봇 상태 관리용 함수
def respond(message, history, state):
    history = history or []
    state = state or {"step": 0, "answers": {}}

    # 사용자가 입력하면 (message, None) 추가
    history.append((message, None))

    # 1단계
    if state["step"] == 0:
        # 챗봇 멘트들을 연속으로 보여주고 싶으면, 한 번에 "\n"으로 합쳐서 답변
        bot_reply = (
            "네 가능합니다! 원하시는 가격과 용도에 맞춰서 짜드리겠습니다😊\n"
            "견적을 짜드리기 전에 몇 가지 간단한 질문이 있습니다! 편하게 말씀해주세요\n"
            "각 부품별로 혹시 선호하는 브랜드나 모델이 있으신가요? (다 말씀하시면 **'이제 견적 짜줘'** 또는 **'견적 보여줘'**라고 해주세요!)"
        )
        history[-1] = (message, bot_reply)
        state["step"] = 1
        return "", history, state

    # 2단계
    if state["step"] == 1:
        lower_message = message.lower()
        if "이제 견적 짜줘" in lower_message or "견적 보여줘" in lower_message:
            bot_reply = (
                "요청하신 내용을 바탕으로 견적을 짜겠습니다! 조금만 기다려주세요 😊\n"
                "견적을 알려드리기 이전에 아래의 필수사항을 꼭 읽어주시기 바랍니다!\n"
                "1. 이 견적에는 윈도우나 리눅스 같은 OS 비용은 포함되어 있지 않습니다.\n"
                "2. 데스크탑 케이스 비용도 포함되지 않은 가격입니다.\n"
                "3. 혹시 마음에 안 드는 부분이 있다면 '**~~를 이렇게 바꿔줘**' 하고 편하게 다시 말해주세요!"
            )
            # 마지막 튜플의 두 번째 값(챗봇 답변)만 채움
            history[-1] = (message, bot_reply)
            state["step"] = 2
            return "", history, state
        else:
            prev = state["answers"].get("brand", "")
            if prev:
                state["answers"]["brand"] += f"\n{message}"
            else:
                state["answers"]["brand"] = message
            # 챗봇이 바로 답하지 않고 입력을 더 기다림 (빈 말풍선 없음)
            return "", history, state

    # 3단계
    if state["step"] == 2:
        # 예시: 추가 요청 처리
        bot_reply = "요청하신 내용을 반영하여 견적을 다시 안내드릴 수 있습니다! (AI 연동 및 수정 로직 구현 필요)"
        history[-1] = (message, bot_reply)
        return "", history, state

    # fallback
    history[-1] = (message, "무슨 말씀이신지 잘 모르겠습니다. 다시 한번 말씀해주시겠어요? 😊")
    return "", history, state
    

# --- 그라디오 인터페이스 설정 부분 ---
with gr.Blocks(theme=gr.themes.Soft(), css=custom_css, fill_height=True) as demo:
    gr.Markdown("""
    <h3 style='margin-bottom: 0;'>UPsetUP 챗봇</h3>
    """)
    chatbot = gr.Chatbot(
        elem_id="chatbot",         # 반드시 elem_id 지정!
        height=None,               # height=None로 두어야 CSS 적용됨
        bubble_full_width=False,
        avatar_images=("https://cdn-icons-png.flaticon.com/512/1946/1946429.png", None), 
        show_copy_button=True
    )
    with gr.Row():
        msg = gr.Textbox(
            show_label=False,
            placeholder="메시지를 입력하세요...",
            scale=8
        )
        clear = gr.Button("초기화", scale=1)

    # 상태(state) 변수 추가 - 대화의 현재 상태를 저장
    state = gr.State({"step": 0, "answers": {}}) # 초기 상태 설정!

    # 메시지 입력 시 respond 함수 호출
    # inputs: 메시지 박스, 챗봇 대화 기록, 상태
    # outputs: 메시지 박스 (입력창 비우기), 챗봇 대화 기록 (업데이트), 상태 (업데이트)
    msg.submit(respond, [msg, chatbot, state], [msg, chatbot, state])

    # 초기화 버튼 클릭 시 상태 초기화
    clear.click(lambda: ("", [], {"step": 0, "answers": {}}), None, [msg, chatbot, state])

# 그라디오 앱 실행
demo.launch(share=True) 

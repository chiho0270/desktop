import gradio as gr
from chatbot.gemini import ask_gemini


# 챗봇 상태 관리용 함수
def respond(message, history, state):
    history = history or []
    state = state or {"step": 0, "answers": {}}

    # 사용자가 입력하면 (message, None) 추가
    history.append((message, None))

    # Gemini API 호출
    bot_reply = ask_gemini(message)
    history[-1] = (message, bot_reply)
    return "", history, state

# --- 그라디오 인터페이스 설정 부분 ---
with gr.Blocks(theme=gr.themes.Soft(), fill_height=True) as demo:
    gr.Markdown("""
    <h3 style='margin-bottom: 0;'>UPsetUP 챗봇</h3>
    """)
    chatbot = gr.Chatbot(
        elem_id="chatbot",         # 반드시 elem_id 지정!
        height=600,               # height=None로 두어야 CSS 적용됨
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
    msg.submit(respond, [msg, chatbot, state], [msg, chatbot, state])

    # 초기화 버튼 클릭 시 상태 초기화
    clear.click(lambda: ("", [], {"step": 0, "answers": {}}), None, [msg, chatbot, state])

# 그라디오 앱 실행
demo.launch(share=True)

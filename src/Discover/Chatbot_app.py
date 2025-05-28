import google.generativeai as genai
import os
import gradio as gr

GEMINI_API_KEY = "AIzaSyBABSX9mx-EBIBmGH3fRfegdsJolM1Pscc"
genai.configure(api_key=GEMINI_API_KEY)
MODEL_TO_USE = 'models/gemini-2.0-flash-lite-001'

try:
    model = genai.GenerativeModel(MODEL_TO_USE)
    print(f"'{MODEL_TO_USE}' 모델 로딩 성공 ")
except Exception as e:
    print(f"오류: 모델 로딩 실패 . 모델 이름 '{MODEL_TO_USE}'을 확인해 주세요.")
    print(f"오류 내용: {e}")
    exit()

def ask_gemini(question):
    try:
        gemini_response = model.generate_content(question)
        return gemini_response.text
    except Exception as e:
        return f"Gemini API 오류: {e}"

def respond(message, history, state):
    history = history or []
    state = state or {"step": 0, "answers": {}}
    history.append((message, None))
    bot_reply = ask_gemini(message)
    history[-1] = (message, bot_reply)
    return "", history, state

with gr.Blocks(theme=gr.themes.Soft(), fill_height=True) as demo:
    gr.Markdown("""
    <h3 style='margin-bottom: 0;'>UPsetUP 챗봇</h3>
    """)
    chatbot = gr.Chatbot(
        elem_id="chatbot",
        height=600,
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
    state = gr.State({"step": 0, "answers": {}})
    msg.submit(respond, [msg, chatbot, state], [msg, chatbot, state])
    clear.click(lambda: ("", [], {"step": 0, "answers": {}}), None, [msg, chatbot, state])

demo.launch(share=True)

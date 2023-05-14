import sys
# pyinstaller --noconsoleエラー対策
#outfile = open("logfile.txt", "wt")
#sys.stderr = outfile
#sys.stdout = outfile

import eel
import openai
import os
import settings


if not os.path.exists("config"):
    os.makedirs("config")


# EELアプリケーションの名前
app_name="html"
# EELアプリケーションのエントリーポイント
end_point="index.html"
# EELアプリケーションのウィンドウサイズ
size=(1000,800)

# EELからPython関数を呼び出せるようにするデコレータ
@eel.expose
def chat_gpt(question, language):

    # OpenAI APIキーを設定
    openai.api_key = get_api_key()
    # Proxyが必要な場合設定
    #openai.proxy = {
    #"http":"http://10.10.10.1:80",
    #"https":"http://10.10.10.1:80"
    #}
    
    if openai.api_key is None:
        raise ValueError("OPENAI_API_KEY is not set in .env file.")

    question = question + "\n" + settings.UML_PROMPT.replace("[selected_language]", language)
  
    # GPT-3.5に問い合わせて応答を受け取る
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            max_tokens=3024,
            stream = False,
            messages = [
                    {"role": "user", "content": question},
                    ]
        )
    except openai.error.AuthenticationError as error:
        
        error_messages = """エラーが発生しました: \nAPIキーが正しいか確認してください。"""
        eel.send_alert(error_messages)()
        return ""
    except Exception as e:
        error_messages = str(e)
        eel.send_alert(error_messages)()
        return ""

    content = response["choices"][0]["message"]["content"]
    print("content=", content)
    if content[0:13] == "@startmindmap" and content[-11:] == "@endmindmap":
        content = content.replace("@startmindmap", "@startmindmap\n" +  f"{settings.STYLE_SETTING}" + "\n")
        eel.append_textarea(content)()
    else:
        index = content.find('@startmindmap')
        if index != -1:
            substring = content[:index]
            error_messages = "Failed to create mind map.\n" + substring 
        else:
            error_messages = "Failed to create mind map.\n" + content
        eel.send_alert(error_messages)()
        
 

@eel.expose
def get_api_key():
    api_key_path = os.path.join(os.getcwd(), "config", "api_key.txt")
    if os.path.exists(api_key_path):
        with open(api_key_path, "r") as f:
            return f.read()
    else:
        return ""


@eel.expose
def save_api_key(api_key):
    api_key_path = os.path.join(os.getcwd(), "config", "api_key.txt")
    with open(api_key_path, "w") as f:
        f.write(api_key)


eel.init("html")
eel.start('index.html', size=size)